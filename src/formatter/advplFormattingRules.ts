import { RulesFormatting, IndentationRule } from './formattingRules';

export class AdvplFormattingRules extends RulesFormatting {
  // marcadores regexp utilizados
  // (\s+) = um ou mais whitespaces
  // (\w+) = uma ou mais letras/digitos => palavra
  // (constante) = constante (palavra chave)
  // (.*) =  qualquer coisa
  // ? = 0 ou mais ocorrências
  // ^ = inicio da linha
  // /i = ignorar caixa
  // (\W+) = sem uma ou mais letras/digitos => sem palavra

  protected loadCustomRules(): IndentationRule[] {
    return [];
  }

  protected loadRulesExpressions(): IndentationRule[] {
    return [
      {
        id: 'function',
        expression: /^(\s*)((\w+)(\s+))?(function)(\W+)/i,
        increment: true,
        decrement: false,
        reset: true,
      },
      {
        id: 'method',
        expression: /^(\s*)(method)(\s+)(\w+)(\s*)(.*)(\s+)(class)(\W+)/i,
        increment: true,
        decrement: false,
        reset: true,
      },
      {
        id: 'wsmethod',
        expression: /^(\s*)(wsmethod)(\s+)(\w+)(\s*)(.*)(\s+)(wsservice)(\W+)/i,
        increment: true,
        decrement: false,
        reset: true,
      },
      {
        id: 'comment line (start line)',
        expression: /^(\/\/)(.*)/i,
        increment: false,
        decrement: false,
        reset: false,
      },
      {
        id: '#ifdef/#ifndef',
        expression: /^(\s*)(#)(\s*)(ifdef|ifndef)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: '#else',
        expression: /^(\s*)(#)(\s*)(else)(\W+)/i,
        increment: true,
        decrement: true,
        reset: false,
      },
      {
        id: '#endif',
        expression: /^(\s*)(#)(\s*)(endif)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        //as regras de PDOC devem ser executadas antes do bloco de comentários
        id: 'start pdoc block',
        expression: /^(\/\*\/{Protheus\.doc})/i,
        increment: false,
        decrement: false,
        reset: false,
        ignore_at: 'end pdoc block',
      },
      {
        id: 'end pdoc block',
        expression: /(\/\*\/)/i,
        increment: false,
        decrement: false,
        reset: false,
      },
      {
        id: 'comment block (line)',
        expression: /^(\s*)(\/\*)(.*)(\*\/)/i,
        increment: false,
        decrement: false,
        reset: false,
      },
      {
        id: 'start comment block',
        expression: /^(\s*)(\/\*)/i,
        increment: false,
        decrement: false,
        reset: false,
        ignore_at: 'end comment block',
      },
      {
        id: 'end comment block',
        expression: /^(\s*)(\*\/)/i,
        increment: false,
        decrement: false,
        reset: false,
      },
      {
        id: 'begin report query',
        expression: /^(\s*)(begin)(\s+)(report)(\s+)(query)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end report query',
        expression: /^(\s*)(end)(\s+)(report)(\s+)(query)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'begin transaction',
        expression: /^(\s*)(begin)(\s+)(transaction)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end transaction',
        expression: /^(\s*)(end)(\s+)(transaction)?(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'beginsql (alias)?',
        expression: /^(\s*)(beginsql)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
        ignore_at: 'endsql',
        // subrules: new SqlFormattingRules()
      },
      {
        id: 'endsql',
        expression: /^(\s*)(endsql)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'do case',
        expression: /^(\s*)(do)(\s+)(case)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'case/otherwise',
        expression: /^(\s*)(case|otherwise)(\W+)/i,
        increment: true,
        decrement: true,
        reset: false,
      },
      {
        id: 'end case',
        expression: /^(\s*)(end)(\s*)(case)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'try',
        expression: /^(\s*)(try)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'catch',
        expression: /^(\s*)(catch)(\W+)/i,
        increment: true,
        decrement: true,
        reset: false,
      },
      {
        id: 'end try',
        expression: /^(\s*)(end)(\s*)(try)?(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'class',
        expression: /^(\s*)(class)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end class',
        expression: /^(\s*)(end)(\s*)(class)?(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'wsclient',
        expression: /^(\s*)(wsclient)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end wsclient',
        expression: /^(\s*)(endwsclient)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'for',
        expression: /^(\s*)(for)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'next',
        expression: /^(\s*)(next\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'if',
        expression: /^(\s*)(if)(.*)+/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'else',
        expression: /^(\s*)((else)|(elseif))(\W+)/i,
        increment: true,
        decrement: true,
        reset: false,
      },
      {
        id: 'endif',
        expression: /^(\s*)(end)(\s*)(if)?(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'structure',
        expression: /^(\s*)(structure)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end structure',
        expression: /^(\s*)(end)(\s*)(structure)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'while',
        expression: /^(\s*)(do)?(\s*)(while)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end do',
        expression: /^(\s*)(end)?(\s*)(do)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'wsrestful',
        expression: /^(\s*)(wsrestful)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end wsrestful',
        expression: /^(\s*)(end)(\s*)(wsrestful)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'wsservice',
        expression: /^(\s*)(wsservice)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end wsservice',
        expression: /^(\s*)(end)(\s*)(wsservice)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'wsstruct',
        expression: /^(\s*)(wsstruct)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'end wsstruct',
        expression: /^(\s*)(end)(\s*)(wsstruct)(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'begin sequence',
        expression: /^(\s*)(begin)(\s*)(sequence)(\W+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: 'recover',
        expression: /^(\s*)(recover)(\s*)(sequence)(\W+)/i,
        increment: true,
        decrement: true,
        reset: false,
      },
      {
        id: 'end sequence',
        expression: /^(\s*)(end)(\s*)(sequence)?(\W+)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: 'begin comment block',
        expression: /^(\s+)\/\*/i,
        increment: false,
        decrement: false,
        reset: false,
        ignore_at: 'end comment block',
      },
      {
        id: 'end comment block',
        expression: /^(\s+)\*\//i,
        increment: false,
        decrement: false,
        reset: false,
      },
    ];
  }
}
