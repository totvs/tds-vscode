import { isNull } from "util";

export interface Rule {
	id: string;
	options?: {
		ident: boolean;
		linesBefore: Number;
		linesAfter: Number;
		linesSameBlock: Number;
	};
}

export interface ClosedStructureRule extends Rule {
	begin: RegExp;
	middle?: RegExp;
	end: RegExp;
}

export interface OpenStructureRule extends Rule {
	expression: RegExp;
}


export interface RuleMatch {
	rule: Rule;
	increment: boolean;
	decrement: boolean;
}

export class FormattingRules {
	lastMatch: RuleMatch | null = null;
	insideOpenStructure: boolean = false;

	private instanceOfOpenStructureRule(object: any): object is OpenStructureRule {
		return 'expression' in object;
	}

	private instanceOfClosedStructureRule(object: any): object is ClosedStructureRule {
		return 'begin' in object;
	}

	public match(line: string): boolean {
		if (line.trim().length === 0) {
			return false;
		}

		let finddedRule: any = null;

		this.getRules().every((rule: Rule) => {

			if (this.instanceOfOpenStructureRule(rule)) {
				if (line.match(rule.expression)) {
					finddedRule = { rule: rule, increment: true, decrement: this.insideOpenStructure };
					this.insideOpenStructure = true;
				}
			} else if (this.instanceOfClosedStructureRule(rule)) {
				if (line.match(rule.begin)) {
					finddedRule = { rule: rule, increment: true, decrement: false };
				} else if ((rule.middle) && (line.match(rule.middle))) {
					finddedRule = { rule: rule, increment: true, decrement: true };
				} else if (line.match(rule.end)) {
					finddedRule = { rule: rule, increment: false, decrement: true };
				}
			}

			return isNull(finddedRule);
		});

		if (!isNull(finddedRule)) {
			this.lastMatch = finddedRule;
			return true;
		}

		return false;
	}

	public getLastMatch(): RuleMatch | null {
		return this.lastMatch;
	}

	public getRules(): Rule[] {
		return [...this.getClosedStructures(), ...this.getOpenStructures(), ...this.getCustomStructures()];
	}

	private getCustomStructures(): Rule[] {
		return [];
	}

	// marcadores regexp utilizados
	// (\s+) = um ou mais whitespaces
	// (\w+) = uma ou mais letras/digitos => palavra
	// (constante) = constante (palavra chave)
	// (.*) =  qualquer coisa
	// ? = 0 ou mais ocorrências
	// ^ = inicio da linha
	// /i = ignorar caixa
	


	private getOpenStructures(): OpenStructureRule[] {
		return [{
			id: 'function',
			expression: /^(\s+)?((\w+)(\s+))?(function)(\s+)(\w+)/i
		}, {
			id: 'method',
			expression: /^(\s+)?(method)(\s+)(\w+)(\s+)?(.*)(\s+)(class)(\s+)(\w+)/i
		}];

	}
	private getClosedStructures(): ClosedStructureRule[] {
		return [{
			id: '#ifdef/#ifndef',
			begin: /^(\s+)?(#)(\s+)?(ifdef|ifndef)/i,
			middle: /^(\s+)?(#)(\s+)?(else)/i,
			end: /^(\s+)?(#)(\s+)?(endif)/i
		},
		{
			id: 'BEGIN REPORT QUERY',
			begin: /^(\s+)?(begin)(\s+)(report)(\s+)(query)/i,
			end: /^(\s+)?(end)(\s+)(report)(\s+)(query)/i,
		},
		{
			id: 'BEGIN TRANSACTION',
			begin: /^(\s+)?(begin)(\s+)(transaction)/i,
			end: /^(\s+)?(end)(\s+)(transaction)?/i,
		},
		{
			id: 'B E G I N S Q L ( A L I A S)?',
			begin: /^(\s+)?(beginsql)(\s+)(\w+)/i,
			end: /^(\s+)?(endsql)/i,
		},
		{
			id: 'DO C A S E',
			begin: /^(\s+)?(do)(\s+)(case)/i,
			middle: /^(\s+)?(case|otherwise)/i,
			end: /^(\s+)?(end)(\s+)?(case)/i
		},
		{
			id: 'C A T C H',
			begin: /^(\s+)?(try)/i,
			middle: /^(\s+)?(catch)/i,
			end: /^(\s+)?(end)(\s+)?(try)?/i
		},
		{
			id: 'C L A S S',
			begin: /^(\s+)?(class)(\s+)(\w+)/i,
			end: /^(\s+)?(end)(\s+)?(class)?/i
		},
		{
			id: 'E N D W S C L I E N T',
			begin: /^(\s+)?(wsclient)(\s+)(\w+)/i,
			end: /^(\s+)?(endwsclient)/i
		},

		{
			id: 'F O R',
			begin: /^(\s+)?(for)(\s+)(\w+)/i,
			end: /^(\s+)?(next)/i
		},
		{
			id: 'I F',
			begin: /^(\s+)?(if)(.*)+/i,
			middle: /^(\s+)?((else)|(elseif))/i,
			end: /^(\s+)?(end)(\s+)?(if)?/i,
		},
		{
			id: 'S T R U C T U R E',
			begin: /^(\s+)?(structure)/i,
			end: /^(\s+)?(end)(\s+)?(structure)/i
		},
		{
			id: 'W H I L E',
			begin: /^(\s+)?(do)?(\s+)?(while)/i,
			end: /^(\s+)?(end)?(\s+)?(do)/i
		},
		{
			id: 'W S R E S T F U L',
			begin: /^(\s+)?(wsrestful)/i,
			end: /^(\s+)?(end)(\s+)?(wsrestful)/i
		},
		{
			id: 'W S S E R V I C E',
			begin: /^(\s+)?(wsservice)/i,
			end: /^(\s+)?(end)(\s+)?(wsservice)/i
		},
		{
			id: 'W S S T R U C T',
			begin: /^(\s+)?(wsstruct)/i,
			end: /^(\s+)?(end)(\s+)?(wsstruct)/i
		},
		{
			id: 'B E G I N (WS)? S E Q U E N C E',
			begin: /^(\s+)?(begin)(\s+)?(sequence)/i,
			middle: /^(\s+)?(recover)(\s+)?(sequence)/i,
			end: /^(\s+)?(end)(\s+)?(sequence)?/i
		}
		];
	}
}