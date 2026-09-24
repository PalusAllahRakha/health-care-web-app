import type { LabResult, SeverityFlag } from "@/types";

const insights: Record<string, { summary: string; action: string }> = {
  default: {
    summary: "This result is part of your routine health monitoring. Your provider will review it with your overall care plan.",
    action: "Contact your care team if you have questions about this test.",
  },
};

const flagGuidance: Record<SeverityFlag, string> = {
  normal: "Your result falls within the expected reference range. No immediate action is typically needed.",
  borderline: "Your result is slightly outside the typical range. Your provider may recommend follow-up or lifestyle changes.",
  critical: "This result requires prompt attention. Please contact your provider as soon as possible.",
};

export function getLabInsight(result: LabResult) {
  const specific = insights[result.testName.toLowerCase()];
  return {
    summary: specific?.summary ?? flagGuidance[result.flag],
    action: specific?.action ?? (result.flag === "critical"
      ? "Call your provider or use secure messaging to discuss next steps."
      : "Discuss at your next visit or message your care team if concerned."),
  };
}
