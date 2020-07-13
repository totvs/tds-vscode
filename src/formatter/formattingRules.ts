
export interface IndentationRule {
	id: string;
	increment: boolean;
	decrement: boolean;
	reset: boolean;
	expression: RegExp;
	ignore_at?: string;
	subrules?: RulesFormatting;
}

export interface RuleMatch {
	rule: IndentationRule;
}

export abstract class RulesFormatting {
	private lastMatch: RuleMatch | null = null;
	private customRules: IndentationRule[] = null;
	private rulesExpressions: IndentationRule[] = null;

	constructor() {
		this.rulesExpressions = this.loadRulesExpressions();
		this.customRules = this.loadCustomRules();
	}

	private instanceOfRule(object: any): object is IndentationRule {
		return 'expression' in object;
	}

	public match(line: string): boolean {
		if (line.trim().length === 0) {
			return false;
		}

		let finddedRule: RuleMatch | null = null;

		this.getRules().every((rule: IndentationRule) => {
			if (this.instanceOfRule(rule)) {
				if (line.match(rule.expression)) {
					finddedRule = { rule: rule };
				}
			}

			return finddedRule === null;
		});

		if (finddedRule !== null) {
			this.lastMatch = finddedRule;
			return true;
		}

		return false;
	}

	public getLastMatch(): RuleMatch | null {
		return this.lastMatch;
	}

	public getRules(): IndentationRule[] {
		return [...this.rulesExpressions, ...this.customRules];
	}

	// marcadores regexp utilizados
	// (\s+) = um ou mais whitespaces
	// (\w+) = uma ou mais letras/digitos => palavra
	// (constante) = constante (palavra chave)
	// (.*) =  qualquer coisa
	// ? = 0 ou mais ocorrências
	// ^ = inicio da linha
	// /i = ignorar caixa
	protected abstract loadCustomRules(): IndentationRule[];
	protected abstract loadRulesExpressions(): IndentationRule[];
}

/*
Motor comentado para issue: https://github.com/totvs/tds-vscode/issues/214
Todo conteudo entre o BeginSql e o EndSql será ignorado, pemitindo ao
analista manter sua formatação de preferencia

class ResetFormattingRules extends FormattingRules {
	protected getRulesExpressions(): IndentationRule[] {
		return [];
	}
}

class SqlFormattingRules extends FormattingRules {
	protected getRulesExpressions(): IndentationRule[] {
		return [{
			id: 'endsql',
			expression: /^(\s*)(endsql)/i,
			increment: false,
			decrement: true,
			reset: false,
			subrules: new ResetFormattingRules()
		}, {
			id: 'select',
			expression: /^(\s*)(select)/i,
			increment: true,
			decrement: false,
			reset: false
		}, {
			id: 'from',
			expression: /^(\s*)(from)/i,
			increment: true,
			decrement: true,
			reset: false
		}, {
			id: 'where',
			expression: /^(\s*)(where)/i,
			increment: true,
			decrement: true,
			reset: false
		}, {
			id: 'order',
			expression: /^(\s*)(order)/i,
			increment: true,
			decrement: true,
			reset: false
		}, {
			id: 'group',
			expression: /^(\s*)(group)/i,
			increment: true,
			decrement: true,
			reset: false
		}, {
			id: 'case',
			expression: /^(\s*)(case)/i,
			increment: true,
			decrement: false,
			reset: false
		}, {
			id: 'when',
			expression: /^(\s*)(when)/i,
			increment: true,
			decrement: true,
			reset: false
		}, {
			id: 'else',
			expression: /^(\s*)(else)/i,
			increment: true,
			decrement: true,
			reset: false
		}, {
			id: 'end',
			expression: /^(\s*)(end)/i,
			increment: false,
			decrement: true,
			reset: false
		}];
	}
}
*/