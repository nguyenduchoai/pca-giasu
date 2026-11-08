import { NextResponse } from "next/server";
import {
  calculatePackageQuote,
  calculateOrderCommissionPlan,
  traceAdaptiveKnowledgeGraph,
  maskContactInfo,
  detectSafetyRisk,
} from "@oylg/shared";

export async function GET() {
  const samplePricing = calculatePackageQuote({
    basePriceVnd: 200_000,
    expertTier: 2,
    grade: 10,
    deliveryMode: "AT_HOME",
    classType: "ONE_ON_ONE",
    sessionsPerWeek: 2,
    termMonths: 6,
  });

  const sampleCommission = calculateOrderCommissionPlan({
    orderCode: "ORD-API-001",
    packageBillingModel: "MONTHLY",
    firstPaymentVnd: 4_000_000,
    monthlyFeeVnd: 4_000_000,
    orderKind: "NEW",
    sellerRole: "SALES_AGENT",
    advisedByRole: "SALES_AGENT",
    collectedInstallmentsVnd: [4_000_000, 4_000_000, 4_000_000],
  });

  const sampleTracing = traceAdaptiveKnowledgeGraph([
    { unitCode: "TOAN.07.SHT.02", pMastery: 0.85 },
    { unitCode: "TOAN.08.HDT.01", pMastery: 0.35 },
    { unitCode: "TOAN.09.CBH.01", pMastery: 0.25 },
  ]);

  const sampleGuardrail = {
    dlpMask: maskContactInfo("Liên hệ riêng zalo.me/abc hoặc 0987654321"),
    safety: detectSafetyRisk("Học sinh có dấu hiệu căng thẳng thi cử"),
  };

  return NextResponse.json({
    platform: "OYLG (All Your Life) AI-First Platform v1.0",
    modulesActive: "M01..M21",
    engines: {
      samplePricing,
      sampleCommission,
      rootGapsDetected: sampleTracing.rootGaps,
      sampleGuardrail,
    },
  });
}
