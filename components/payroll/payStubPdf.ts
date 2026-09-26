import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

type GeneratePayStubPdfParams = {
  workerName: string;
  workerRole: string;
  payPeriodLabel: string;
  regularHours: number;
  overtimeHours: number;
  hourlyRate: number;
  grossPay: number;
  deductions: number;
  netPay: number;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(amount) ? amount : 0);
}

function buildPayStubHtml(params: GeneratePayStubPdfParams) {
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: #eef2f6;
            color: #101828;
          }
          .card {
            background: #fff;
            border-radius: 16px;
            padding: 18px;
            border: 1px solid #e3e6ea;
          }
          .header {
            text-align: center;
            margin-bottom: 12px;
          }
          .avatar {
            width: 64px;
            height: 64px;
            border-radius: 32px;
            background: #1f5577;
            color: #fff;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 26px;
            font-weight: 700;
          }
          .name {
            font-size: 20px;
            font-weight: 700;
            margin-top: 12px;
          }
          .role {
            font-size: 14px;
            color: #475467;
            margin-top: 4px;
          }
          .period {
            font-size: 12px;
            color: #667085;
            margin-top: 4px;
          }
          .divider {
            height: 1px;
            background: #e6e8eb;
            margin: 14px 0;
          }
          .row {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 10px;
            font-size: 15px;
          }
          .muted {
            color: #475467;
          }
          .section {
            border-radius: 10px;
            background: #f7f8fa;
            padding: 12px;
          }
          .net {
            margin-top: 14px;
            background: #1f5577;
            color: #eaf1f5;
            border-radius: 10px;
            padding: 16px;
            text-align: center;
          }
          .net-title {
            font-size: 16px;
          }
          .net-value {
            font-size: 30px;
            font-weight: 700;
            margin-top: 6px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="header">
            <div class="avatar">${escapeHtml(
              params.workerName.charAt(0).toUpperCase() || "W",
            )}</div>
            <div class="name">${escapeHtml(params.workerName || "Worker")}</div>
            <div class="role">${escapeHtml(params.workerRole || "Worker")}</div>
            <div class="period">Pay Period: ${escapeHtml(params.payPeriodLabel)}</div>
          </div>

          <div class="divider"></div>

          <div class="row">
            <div class="muted">Regular Hours (${params.regularHours.toFixed(2)})</div>
            <div>${formatCurrency(params.regularHours * params.hourlyRate)}</div>
          </div>
          <div class="row">
            <div class="muted">Overtime Hours (${params.overtimeHours.toFixed(2)})</div>
            <div>${formatCurrency(0)}</div>
          </div>
          <div class="row">
            <div class="muted">Hourly Rate</div>
            <div>${formatCurrency(params.hourlyRate)}</div>
          </div>

          <div class="divider"></div>

          <div class="row" style="font-size:16px;font-weight:700;">
            <div>Gross Pay</div>
            <div>${formatCurrency(params.grossPay)}</div>
          </div>

          <div class="section">
            <div style="font-size:16px;font-weight:700;margin-bottom:10px;">Deductions</div>
            <div class="row">
              <div class="muted">Estimated Tax</div>
              <div>${formatCurrency(params.deductions)}</div>
            </div>
            <div class="divider" style="margin: 10px 0;"></div>
            <div class="row" style="font-size:16px;font-weight:700;">
              <div>Total Deductions</div>
              <div>${formatCurrency(params.deductions)}</div>
            </div>
          </div>

          <div class="net">
            <div class="net-title">Net Pay</div>
            <div class="net-value">${formatCurrency(params.netPay)}</div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export async function downloadPayStubPdf(params: GeneratePayStubPdfParams) {
  const html = buildPayStubHtml(params);
  const result = await Print.printToFileAsync({ html });

  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert("PDF Ready", `Pay stub PDF created at: ${result.uri}`);
    return result.uri;
  }

  await Sharing.shareAsync(result.uri, {
    mimeType: "application/pdf",
    dialogTitle: "Download Pay Stub PDF",
    UTI: "com.adobe.pdf",
  });

  return result.uri;
}
