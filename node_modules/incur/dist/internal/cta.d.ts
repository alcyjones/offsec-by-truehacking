/** @internal A CTA block before command names are expanded. */
export type CtaBlock = {
    commands: unknown[];
    description?: string | undefined;
};
/** @internal A formatted CTA block as it appears in output metadata. */
export type FormattedCtaBlock = {
    /** Formatted command suggestions. */
    commands: FormattedCta[];
    /** Human-readable label for the CTA block. */
    description: string;
};
/** @internal A formatted CTA as it appears in output metadata. */
export type FormattedCta = {
    /** The full command string with args and options folded in. */
    command: string;
    /** A short description of what the command does. */
    description?: string | undefined;
};
/** @internal Formats a CTA block into the output metadata shape. */
export declare function formatCtaBlock(name: string, block: CtaBlock | undefined): FormattedCtaBlock | undefined;
/** @internal Renders a formatted CTA block as plain text for inline tool output. */
export declare function renderCtaText(block: FormattedCtaBlock): string;
//# sourceMappingURL=cta.d.ts.map