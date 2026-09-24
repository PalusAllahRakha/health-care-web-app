import { getLabInsight } from "@/lib/lab-insights";
import { formatDate } from "@/lib/utils";
import type { LabResult } from "@/types";

export type LabReportImageFormat = "png" | "webp";

interface ExportOptions {
  patientName?: string;
}

const FLAG_COLORS: Record<LabResult["flag"], string> = {
  normal: "#0d9488",
  borderline: "#d97706",
  critical: "#dc2626",
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function getLabReportFilename(results: LabResult[], format: "pdf" | LabReportImageFormat) {
  const date = new Date().toISOString().slice(0, 10);
  if (results.length === 1) {
    return `lab-report-${slugify(results[0].testName)}-${results[0].date}.${format}`;
  }
  return `lab-results-${date}.${format}`;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  if (line) ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

function drawLabReportCanvas(results: LabResult[], patientName: string) {
  const width = 900;
  const lineHeight = 22;
  const margin = 48;
  const contentWidth = width - margin * 2;
  const blocks = results.map((result) => {
    const insight = getLabInsight(result);
    const lines =
      8 +
      Math.ceil(insight.summary.length / 90) +
      Math.ceil(insight.action.length / 90) +
      (result.history.length > 0 ? 2 : 0);
    return lines * lineHeight + 36;
  });
  const height = margin * 2 + 120 + blocks.reduce((sum, block) => sum + block, 0);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Unable to create report image");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "#0f766e";
  ctx.fillRect(0, 0, width, 8);

  let y = margin + 8;
  ctx.fillStyle = "#111827";
  ctx.font = "bold 28px Outfit, system-ui, sans-serif";
  ctx.fillText("HealthPortal Lab Report", margin, y);

  y += 34;
  ctx.font = "16px Outfit, system-ui, sans-serif";
  ctx.fillStyle = "#4b5563";
  ctx.fillText(`Patient: ${patientName}`, margin, y);
  y += 24;
  ctx.fillText(`Generated: ${formatDate(new Date().toISOString())}`, margin, y);
  y += 36;

  results.forEach((result, index) => {
    if (index > 0) y += 12;

    ctx.strokeStyle = "#e5e7eb";
    ctx.strokeRect(margin, y - 12, contentWidth, blocks[index] - 12);

    ctx.fillStyle = "#111827";
    ctx.font = "bold 22px Outfit, system-ui, sans-serif";
    ctx.fillText(result.testName, margin + 16, y + 12);

    ctx.font = "14px Outfit, system-ui, sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText(`Collected ${formatDate(result.date)}`, margin + 16, y + 36);

    ctx.fillStyle = "#111827";
    ctx.font = "bold 34px Outfit, system-ui, sans-serif";
    ctx.fillText(`${result.value} ${result.unit}`, margin + 16, y + 78);

    ctx.font = "16px Outfit, system-ui, sans-serif";
    ctx.fillStyle = "#374151";
    ctx.fillText(
      `Reference: ${result.referenceMin}–${result.referenceMax} ${result.unit}`,
      margin + 16,
      y + 108
    );

    const flagLabel = result.flag.charAt(0).toUpperCase() + result.flag.slice(1);
    const flagWidth = ctx.measureText(flagLabel).width + 24;
    ctx.fillStyle = FLAG_COLORS[result.flag];
    ctx.beginPath();
    ctx.roundRect(width - margin - flagWidth - 16, y + 8, flagWidth, 30, 15);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px Outfit, system-ui, sans-serif";
    ctx.fillText(flagLabel, width - margin - flagWidth - 4, y + 28);

    let textY = y + 142;
    const insight = getLabInsight(result);
    ctx.fillStyle = "#111827";
    ctx.font = "bold 16px Outfit, system-ui, sans-serif";
    ctx.fillText("What this means", margin + 16, textY);
    textY += 24;

    ctx.fillStyle = "#4b5563";
    ctx.font = "15px Outfit, system-ui, sans-serif";
    textY = wrapText(ctx, insight.summary, margin + 16, textY, contentWidth - 32, lineHeight);

    ctx.fillStyle = "#111827";
    ctx.font = "bold 15px Outfit, system-ui, sans-serif";
    ctx.fillText("Recommended action", margin + 16, textY + 4);
    textY += 24;

    ctx.fillStyle = "#4b5563";
    ctx.font = "15px Outfit, system-ui, sans-serif";
    textY = wrapText(ctx, insight.action, margin + 16, textY, contentWidth - 32, lineHeight);

    if (result.history.length > 0) {
      const history = result.history
        .map((point) => `${formatDate(point.date)}: ${point.value} ${result.unit}`)
        .join("  ·  ");
      ctx.fillStyle = "#111827";
      ctx.font = "bold 15px Outfit, system-ui, sans-serif";
      ctx.fillText("Trend history", margin + 16, textY + 4);
      textY += 24;
      ctx.fillStyle = "#4b5563";
      ctx.font = "14px Outfit, system-ui, sans-serif";
      wrapText(ctx, history, margin + 16, textY, contentWidth - 32, lineHeight);
    }

    y += blocks[index];
  });

  ctx.fillStyle = "#9ca3af";
  ctx.font = "12px Outfit, system-ui, sans-serif";
  ctx.fillText("Confidential health information — for personal records only.", margin, height - 24);

  return canvas;
}

export async function exportLabReportPdf(results: LabResult[], options: ExportOptions = {}) {
  const patientName = options.patientName ?? "Patient";
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const margin = 20;
  let y = margin;

  doc.setFontSize(18);
  doc.text("HealthPortal Lab Report", margin, y);
  y += 10;

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Patient: ${patientName}`, margin, y);
  y += 6;
  doc.text(`Generated: ${formatDate(new Date().toISOString())}`, margin, y);
  y += 12;

  doc.setTextColor(0);
  doc.setFontSize(10);

  results.forEach((result) => {
    const insight = getLabInsight(result);

    if (y > 250) {
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.text(result.testName, margin, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(`Collected: ${formatDate(result.date)}`, margin, y);
    y += 6;
    doc.text(
      `Result: ${result.value} ${result.unit}  |  Reference: ${result.referenceMin}–${result.referenceMax} ${result.unit}`,
      margin,
      y
    );
    y += 6;
    doc.text(`Status: ${result.flag}`, margin, y);
    y += 8;
    doc.text("What this means:", margin, y);
    y += 5;
    const summaryLines = doc.splitTextToSize(insight.summary, 170);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 3;
    doc.text("Recommended action:", margin, y);
    y += 5;
    const actionLines = doc.splitTextToSize(insight.action, 170);
    doc.text(actionLines, margin, y);
    y += actionLines.length * 5 + 8;
  });

  doc.save(getLabReportFilename(results, "pdf"));
}

export async function exportLabReportImage(
  results: LabResult[],
  format: LabReportImageFormat,
  options: ExportOptions = {}
) {
  const patientName = options.patientName ?? "Patient";
  const canvas = drawLabReportCanvas(results, patientName);
  const mimeType = format === "webp" ? "image/webp" : "image/png";
  const filename = getLabReportFilename(results, format);

  await new Promise<void>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Unable to create report image"));
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      mimeType,
      0.92
    );
  });
}
