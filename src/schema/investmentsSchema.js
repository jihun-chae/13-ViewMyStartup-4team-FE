import { z } from "zod";

export const investmentSchema = z
  .object({
    investorName: z.string().min(1, "투자자 이름을 입력해 주세요."),
    amount: z
      .string()
      .min(1, "투자 금액을 입력해 주세요.")
      .refine(
        (val) => !isNaN(Number(val.replace(/,/g, ""))),
        "숫자만 입력해 주세요.",
      ),
    comment: z.string().min(1, "투자 코멘트를 입력해 주세요."),
    password: z.string().min(1, "비밀번호를 입력해 주세요."),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해 주세요."),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password && passwordConfirm && password !== passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 일치하지 않습니다.",
        path: ["passwordConfirm"],
      });
    }
  });
