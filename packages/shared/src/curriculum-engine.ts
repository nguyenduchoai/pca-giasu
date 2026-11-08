// ============================================================================
// CURRICULUM GRAPH (GDPT 2018) & ADAPTIVE KNOWLEDGE TRACING ENGINE (M04, M05, M06, M07)
// Truy ngược lỗ hổng kiến thức từ lớp hiện tại xuống lớp dưới theo quan hệ tiên quyết
// ============================================================================

import { SubjectCode } from "./types";

export type MasteryStatus =
  | "MASTERED"
  | "PARTIAL"
  | "NOT_MASTERED"
  | "INFERRED_MASTERED"
  | "UNCHECKED";

export interface CurriculumUnitNode {
  code: string;
  subject: SubjectCode;
  grade: number;
  chapter: string;
  title: string;
  description: string;
  prereqCodes: string[];
  examWeight: number; // 1..10 (trọng số trong kỳ thi vào 10 / THPT)
  textbook: string;
}

/**
 * Đồ thị YCCĐ mẫu chuẩn Chương trình GDPT 2018 (Bộ Kết nối tri thức với cuộc sống)
 * Liên kết xuyên cấp từ Lớp 6 -> Lớp 11 để minh họa thuật toán truy ngược lỗ hổng gốc (Root Gap)
 */
export const GDPT2018_CURRICULUM_GRAPH: CurriculumUnitNode[] = [
  {
    code: "TOAN.06.PS.01",
    subject: "TOAN",
    grade: 6,
    chapter: "Phân số & Số thập phân",
    title: "Quy đồng mẫu số và cộng trừ phân số",
    description: "Thực hiện phép tính cộng, trừ, nhân, chia với phân số",
    prereqCodes: [],
    examWeight: 6,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.07.SHT.02",
    subject: "TOAN",
    grade: 7,
    chapter: "Số hữu tỉ",
    title: "Các phép tính với số hữu tỉ & lũy thừa",
    description: "Vận dụng quy tắc dấu ngoặc, chuyển vế trên tập Q",
    prereqCodes: ["TOAN.06.PS.01"],
    examWeight: 7,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.07.TLT.04",
    subject: "TOAN",
    grade: 7,
    chapter: "Tỉ lệ thức & Đại lượng tỉ lệ",
    title: "Tính chất dãy tỉ số bằng nhau",
    description: "Giải toán chia tỉ lệ và biến đổi đẳng thức",
    prereqCodes: ["TOAN.07.SHT.02"],
    examWeight: 7,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.08.HDT.01",
    subject: "TOAN",
    grade: 8,
    chapter: "Đa thức & Hằng đẳng thức",
    title: "7 Hằng đẳng thức đáng nhớ & Phân tích đa thức thành nhân tử",
    description: "Biến đổi biểu thức đại số và rút gọn phân thức",
    prereqCodes: ["TOAN.07.SHT.02"],
    examWeight: 9,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.08.PTB1.03",
    subject: "TOAN",
    grade: 8,
    chapter: "Phương trình bậc nhất",
    title: "Giải phương trình bậc nhất một ẩn & phương trình quy về bậc nhất",
    description: "Biến đổi tương đương, tìm điều kiện xác định của phương trình chứa ẩn ở mẫu",
    prereqCodes: ["TOAN.07.SHT.02", "TOAN.08.HDT.01"],
    examWeight: 9,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.09.CBH.01",
    subject: "TOAN",
    grade: 9,
    chapter: "Căn bậc hai & Căn bậc ba",
    title: "Biến đổi đơn giản và rút gọn biểu thức chứa căn thức bậc hai",
    description: "Tìm ĐKXĐ, trục căn thức ở mẫu, rút gọn biểu thức tổng hợp (Câu 1 đề thi vào 10)",
    prereqCodes: ["TOAN.08.HDT.01", "TOAN.08.PTB1.03"],
    examWeight: 10,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.09.HPT.02",
    subject: "TOAN",
    grade: 9,
    chapter: "Hệ phương trình & Phương trình bậc hai",
    title: "Giải hệ phương trình bậc nhất hai ẩn & Định lý Vi-ét",
    description: "Giải bài toán bằng cách lập hệ phương trình và ứng dụng hệ thức Vi-ét",
    prereqCodes: ["TOAN.08.PTB1.03", "TOAN.07.TLT.04"],
    examWeight: 10,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.10.HSB2.01",
    subject: "TOAN",
    grade: 10,
    chapter: "Hàm số bậc hai & Đồ thị",
    title: "Khảo sát sự biến thiên, bảng biến thiên và cực trị Parabol",
    description: "Xác định trục đối xứng, đỉnh Parabol và giải bất phương trình bậc hai",
    prereqCodes: ["TOAN.09.HPT.02", "TOAN.09.CBH.01"],
    examWeight: 9,
    textbook: "Kết nối tri thức",
  },
  {
    code: "TOAN.11.LG.01",
    subject: "TOAN",
    grade: 11,
    chapter: "Hàm số lượng giác & Phương trình lượng giác",
    title: "Biến đổi công thức lượng giác & Giải phương trình lượng giác cơ bản",
    description: "Kết hợp biến đổi đại số và nghiệm lượng giác trên đường tròn đơn vị",
    prereqCodes: ["TOAN.10.HSB2.01", "TOAN.08.HDT.01"],
    examWeight: 9,
    textbook: "Kết nối tri thức",
  },
];

export interface UnitAssessmentScoreInput {
  unitCode: string;
  pMastery: number; // 0.0 -> 1.0
}

export interface EvaluatedCurriculumUnit extends CurriculumUnitNode {
  pMastery: number;
  status: MasteryStatus;
  isRootGap: boolean;
  diagnosticNote: string;
}

export interface AdaptiveTracingResult {
  evaluatedUnits: EvaluatedCurriculumUnit[];
  rootGaps: EvaluatedCurriculumUnit[];
  masteredCount: number;
  gapCount: number;
  recommendedNextUnitsToProbe: CurriculumUnitNode[];
  remedialRoadmapOrder: EvaluatedCurriculumUnit[];
}

/**
 * Thuật toán tầm soát kiến thức (Mục 6.2):
 * - Nếu p >= 0.7 -> ĐẠT (MASTERED), suy luận các tiên quyết có khả năng đạt (INFERRED_MASTERED nếu chưa kiểm tra).
 * - Nếu p < 0.5 -> CHƯA ĐẠT (NOT_MASTERED); 0.5 <= p < 0.7 -> HIỂU MỘT PHẦN (PARTIAL).
 * - "Lỗ hổng gốc" (isRootGap = true) = các YCCĐ CHƯA ĐẠT/PARTIAL mà toàn bộ tiên quyết của nó đều ĐẠT (hoặc không có tiên quyết).
 */
export function traceAdaptiveKnowledgeGraph(
  scores: UnitAssessmentScoreInput[],
  graph: CurriculumUnitNode[] = GDPT2018_CURRICULUM_GRAPH
): AdaptiveTracingResult {
  const scoreMap = new Map<string, number>();
  for (const s of scores) {
    scoreMap.set(s.unitCode, s.pMastery);
  }

  // Bước 1: Suy luận nhánh dưới nếu nút trên đã đạt (p >= 0.7)
  const inferredMasteredSet = new Set<string>();
  const nodeMap = new Map<string, CurriculumUnitNode>(
    graph.map((u) => [u.code, u])
  );

  function markPrereqsInferred(code: string) {
    const node = nodeMap.get(code);
    if (!node) return;
    for (const preCode of node.prereqCodes) {
      if (!scoreMap.has(preCode) && !inferredMasteredSet.has(preCode)) {
        inferredMasteredSet.add(preCode);
        markPrereqsInferred(preCode);
      }
    }
  }

  for (const [code, p] of scoreMap.entries()) {
    if (p >= 0.7) {
      markPrereqsInferred(code);
    }
  }

  // Bước 2: Gán trạng thái từng YCCĐ
  const prelimMap = new Map<
    string,
    { pMastery: number; status: MasteryStatus }
  >();

  for (const unit of graph) {
    const directP = scoreMap.get(unit.code);
    if (directP !== undefined) {
      const status: MasteryStatus =
        directP >= 0.7
          ? "MASTERED"
          : directP >= 0.5
          ? "PARTIAL"
          : "NOT_MASTERED";
      prelimMap.set(unit.code, { pMastery: directP, status });
    } else if (inferredMasteredSet.has(unit.code)) {
      prelimMap.set(unit.code, {
        pMastery: 0.78,
        status: "INFERRED_MASTERED",
      });
    } else {
      prelimMap.set(unit.code, { pMastery: 0, status: "UNCHECKED" });
    }
  }

  // Bước 3: Xác định "Lỗ hổng gốc" (Root Gap) và câu cần hỏi tiếp theo (Adaptive Queue)
  const evaluatedUnits: EvaluatedCurriculumUnit[] = [];
  const nextToProbeCodes = new Set<string>();

  for (const unit of graph) {
    const state = prelimMap.get(unit.code)!;
    const isFailing =
      state.status === "NOT_MASTERED" || state.status === "PARTIAL";

    // Nếu YCCĐ này chưa đạt, đẩy các tiên quyết chưa kiểm tra vào hàng đợi hỏi tiếp
    if (isFailing) {
      for (const preCode of unit.prereqCodes) {
        const preState = prelimMap.get(preCode);
        if (preState && preState.status === "UNCHECKED") {
          nextToProbeCodes.add(preCode);
        }
      }
    }

    // Lỗ hổng gốc: YCCĐ đang bị hổng mà tất cả các tiên quyết của nó đều đã MASTERED / INFERRED_MASTERED (hoặc không có tiên quyết)
    const allPrereqsMastered =
      unit.prereqCodes.length === 0 ||
      unit.prereqCodes.every((preCode) => {
        const preState = prelimMap.get(preCode);
        return (
          preState?.status === "MASTERED" ||
          preState?.status === "INFERRED_MASTERED"
        );
      });

    const isRootGap = isFailing && allPrereqsMastered;

    let diagnosticNote = "Chưa kiểm tra trong phiên tầm soát.";
    if (state.status === "MASTERED") {
      diagnosticNote = "Đã nắm vững – đủ nền tảng học phần nâng cao.";
    } else if (state.status === "INFERRED_MASTERED") {
      diagnosticNote =
        "Suy luận ĐẠT từ kết quả làm đúng kiến thức lớp trên (tiết kiệm câu hỏi).";
    } else if (isRootGap) {
      diagnosticNote = `LỖ HỔNG GỐC (Lớp ${unit.grade}): Đây là điểm đứt gãy đầu tiên khiến học sinh sai các bài lớp trên. Cần ưu tiên lấp nền đầu tiên!`;
    } else if (isFailing) {
      diagnosticNote = `Hệ quả do hổng kiến thức tiên quyết từ lớp dưới (${unit.prereqCodes.join(", ")}).`;
    }

    evaluatedUnits.push({
      ...unit,
      pMastery: state.pMastery,
      status: state.status,
      isRootGap,
      diagnosticNote,
    });
  }

  const rootGaps = evaluatedUnits.filter((u) => u.isRootGap);
  const masteredCount = evaluatedUnits.filter(
    (u) => u.status === "MASTERED" || u.status === "INFERRED_MASTERED"
  ).length;
  const gapCount = evaluatedUnits.filter(
    (u) => u.status === "NOT_MASTERED" || u.status === "PARTIAL"
  ).length;

  // Sắp xếp thứ tự lấp lỗ hổng (M07): Ưu tiên Lỗ hổng gốc -> Lớp thấp trước -> Trọng số thi cao
  const remedialRoadmapOrder = evaluatedUnits
    .filter((u) => u.status === "NOT_MASTERED" || u.status === "PARTIAL")
    .sort((a, b) => {
      if (a.isRootGap !== b.isRootGap) return a.isRootGap ? -1 : 1;
      if (a.grade !== b.grade) return a.grade - b.grade;
      return b.examWeight - a.examWeight;
    });

  const recommendedNextUnitsToProbe = graph.filter((u) =>
    nextToProbeCodes.has(u.code)
  );

  return {
    evaluatedUnits,
    rootGaps,
    masteredCount,
    gapCount,
    recommendedNextUnitsToProbe,
    remedialRoadmapOrder,
  };
}
