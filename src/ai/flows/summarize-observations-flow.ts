
'use server';
/**
 * @fileOverview An AI flow to summarize order observations.
 *
 * - summarizeObservations - A function that handles the summarization.
 * - SummarizeObservationsInput - The input type for the function.
 * - SummarizeObservationsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeObservationsInputSchema = z.object({
  observations: z.string().describe('The observations to summarize.'),
});
export type SummarizeObservationsInput = z.infer<typeof SummarizeObservationsInputSchema>;

const SummarizeObservationsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the observations.'),
});
export type SummarizeObservationsOutput = z.infer<typeof SummarizeObservationsOutputSchema>;


const prompt = ai.definePrompt({
  name: 'summarizeObservationsPrompt',
  input: {schema: SummarizeObservationsInputSchema},
  output: {schema: SummarizeObservationsOutputSchema},
  prompt: `Summarize the following order observations concisely. Focus on the key actions or issues mentioned.

Observations: {{{observations}}}`,
});

const summarizeObservationsFlow = ai.defineFlow(
  {
    name: 'summarizeObservationsFlow',
    inputSchema: SummarizeObservationsInputSchema,
    outputSchema: SummarizeObservationsOutputSchema,
  },
  async (input) => {
    if (!input.observations.trim()) {
        return { summary: '' };
    }
    const {output} = await prompt(input);
    return output!;
  }
);

export async function summarizeObservations(input: SummarizeObservationsInput): Promise<SummarizeObservationsOutput> {
  return summarizeObservationsFlow(input);
}
