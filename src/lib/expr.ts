const enum Operator {
    AND = "&&",
    OR = "||",
    NOT = "!"
}

function evaluateToken(token: string, context: Record<string, boolean>): string | boolean | undefined {
    if (token === Operator.AND || token === Operator.OR) return token;
    if (token.startsWith(Operator.NOT)) {
        const variable = token.slice(1);
        return !context[variable];
    }
    return context[token];
}

export function evaluate(expression: string, context: Record<string, boolean>) {
    const tokens = expression.split(/\s+/);

    function _eval(tokens: string[]): boolean {
        const token = tokens.shift();

        if (token === Operator.AND) {
            return _eval(tokens) && _eval(tokens);
        }
        if (token === Operator.OR) {
            return _eval(tokens) || _eval(tokens);
        }
        return evaluateToken(token!, context) as boolean;
    }

    return _eval(tokens);
}