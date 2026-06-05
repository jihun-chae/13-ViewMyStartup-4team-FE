import { useState } from "react";
import Modal from "@/components/common/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import DefaultLogo from "@/assets/images/default_image.png";
import styles from "./InvestmentsModal.module.css";
import { investmentSchema } from "../../schema/investmentsSchema";

const INITIAL_FORM = {
  investorName: "",
  amount: "",
  comment: "",
  password: "",
  passwordConfirm: "",
};

/**
 * mode="create" : 기업에 투자하기 (기본값)
 * mode="edit"   : 투자 정보 수정하기 — initialData로 기존 값 주입
 *
 * Props
 * - isOpen        : boolean
 * - mode          : "create" | "edit"
 * - initialData   : { investorName, amount, comment }  (edit 모드에서만 사용)
 */
function InvestmentsModal({
  isOpen,
  onClose,
  onSubmit,
  company = {},
  mode = "create",
  initialData = {},
}) {
  const isEdit = mode === "edit";
  const title = isEdit ? "투자 정보 수정하기" : "기업에 투자하기";
  const submitLabel = isEdit ? "수정하기" : "투자하기";

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevMode, setPrevMode] = useState(mode);

  if (isOpen !== prevIsOpen || mode !== prevMode) {
    setPrevIsOpen(isOpen);
    setPrevMode(mode);
    if (isOpen) {
      if (isEdit && initialData) {
        setForm({
          investorName: initialData.investorName ?? "",
          amount: initialData.amount ? String(initialData.amount) : "",
          comment: initialData.comment ?? "",
          password: "",
          passwordConfirm: "",
        });
      } else {
        setForm(INITIAL_FORM);
      }
      setErrors({});
    }
  }

  if (!isOpen) return null;

  function handleChange(field) {
    return (e) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  }

  function validate() {
    const result = investmentSchema.safeParse(form);
    if (result.success) return {};
    return result.error.issues.reduce((acc, issue) => {
      const key = issue.path[0];
      if (key && !acc[key]) acc[key] = issue.message;
      return acc;
    }, {});
  }

  function handleSubmit(e) {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    onSubmit?.({
      investorName: form.investorName,
      amount: Number(form.amount.replace(/,/g, "")),
      comment: form.comment,
      password: form.password,
    });
  }

  return (
    <Modal title={title} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {/* 투자 기업 정보 */}
        <div className={styles.section}>
          <span className={styles.label}>투자 기업 정보</span>
          <div className={styles.companyInfo}>
            <img
              src={company.imgUrl || DefaultLogo}
              alt={company.name || "기업 로고"}
              className={styles.companyLogo}
            />
            <span className={styles.companyName}>{company.name}</span>
            <span className={styles.companyCategory}>{company.category}</span>
          </div>
        </div>

        {/* 투자자 이름 */}
        <div className={styles.section}>
          <label className={styles.label}>투자자 이름</label>
          <Input
            placeholder="투자자 이름을 입력해 주세요"
            value={form.investorName}
            onChange={handleChange("investorName")}
            errorMessage={errors.investorName}
          />
        </div>

        {/* 투자 금액 */}
        <div className={styles.section}>
          <label className={styles.label}>투자 금액</label>
          <Input
            placeholder="투자 금액을 입력해 주세요"
            value={form.amount}
            onChange={handleChange("amount")}
            errorMessage={errors.amount}
          />
        </div>

        {/* 투자 코멘트 */}
        <div className={styles.section}>
          <label className={styles.label}>투자 코멘트</label>
          <textarea
            className={`${styles.textarea} ${errors.comment ? styles.error : ""}`}
            placeholder="투자에 대한 코멘트를 입력해 주세요"
            value={form.comment}
            onChange={handleChange("comment")}
            rows={4}
          />
          {errors.comment && (
            <p className={styles.errorMessage}>{errors.comment}</p>
          )}
        </div>

        {/* 비밀번호 */}
        <div className={styles.section}>
          <label className={styles.label}>비밀번호</label>
          <Input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={form.password}
            onChange={handleChange("password")}
            errorMessage={errors.password}
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className={styles.section}>
          <label className={styles.label}>비밀번호 확인</label>
          <Input
            type="password"
            placeholder="비밀번호를 다시 한 번 입력해주세요"
            value={form.passwordConfirm}
            onChange={handleChange("passwordConfirm")}
            errorMessage={errors.passwordConfirm}
          />
        </div>

        <div className={styles.btnWrapper}>
          <Button variant="solidOutline" onClick={onClose} type="button">
            취소
          </Button>
          <Button variant="solid" status="active" type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default InvestmentsModal;
