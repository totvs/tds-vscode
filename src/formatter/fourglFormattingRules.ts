import { RulesFormatting, IndentationRule } from "./formattingRules";

export class FourglFormattingRules extends RulesFormatting {
  // marcadores regexp utilizados
  // (\s+) = um ou mais whitespaces
  // (\w+) = uma ou mais letras/digitos => palavra
  // (constante) = constante (palavra chave)
  // (.*) =  qualquer coisa
  // ? = 0 ou mais ocorrências
  // ^ = inicio da linha
  // /i = ignorar caixa
  protected loadCustomRules(): IndentationRule[] {
    return [];
  }

  protected loadRulesExpressions(): IndentationRule[] {
    return [
      {
        id: "function",
        expression: /^(\s*)((\w+)(\s+))?(function)(\s+)(\w+)/i,
        increment: true,
        decrement: false,
        reset: true,
      },
      {
        id: "main",
        expression: /^(\s*)((\w+)(\s+))?(main)/i,
        increment: true,
        decrement: false,
        reset: true,
      },
      {
        id: "end function/main",
        expression: /^(\s*)((\w+)(\s+))?(end)(\s+)(function|main)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: "comment line (start line)",
        expression: /^(#|--)(.*)/i,
        increment: false,
        decrement: false,
        reset: false,
      },
      {
        //as regras de PDOC devem ser executadas antes do bloco de comentários
        id: "start pdoc block",
        expression: /^(\/\*\/{Protheus\.doc})/i,
        increment: false,
        decrement: false,
        reset: false,
        ignore_at: "end pdoc block",
      },
      {
        id: "end pdoc block",
        expression: /(\/\*\/)/i,
        increment: false,
        decrement: false,
        reset: false,
      },
      {
        id: "start comment block",
        expression: /^(\s*)(\/\*)/i,
        increment: false,
        decrement: false,
        reset: false,
        ignore_at: "end comment block",
      },
      {
        id: "end comment block",
        expression: /^(\s*)(\*\/)/i,
        increment: false,
        decrement: false,
        reset: false,
      },
      {
        id: "for",
        expression: /^(\s*)(for)(\s+)(\w+)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: "next",
        expression: /^(\s*)(next)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: "if",
        expression: /^(\s*)(if)(.*)+/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: "else",
        expression: /^(\s*)((else)|(elseif))/i,
        increment: true,
        decrement: true,
        reset: false,
      },
      {
        id: "endif",
        expression: /^(\s*)(end)(\s*)(if)?/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: "while",
        expression: /^(\s*)(do)?(\s*)(while)/i,
        increment: true,
        decrement: false,
        reset: false,
      },
      {
        id: "end do",
        expression: /^(\s*)(end)?(\s*)(do)/i,
        increment: false,
        decrement: true,
        reset: false,
      },
      {
        id: "begin comment block",
        expression: /^(\s+){\*/i,
        increment: false,
        decrement: false,
        reset: false,
        ignore_at: "end comment block",
      },
      {
        id: "end comment block",
        expression: /^(\s+)}/i,
        increment: false,
        decrement: false,
        reset: false,
      },
    ];
  }
}
