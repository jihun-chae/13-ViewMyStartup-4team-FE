import CompanyCard from "@/components/ui/CompanyCard";
import styles from "./CompareCardContent.module.css";

export default function CompareCardContent({
  compareCompanies,
  onRemove,
}) {
  if (compareCompanies.length === 0) {
    return (
      <p className={styles.emptyText}>
        아직 추가한 기업이 없어요,
        <br />
        버튼을 눌러 기업을 추가해보세요!
      </p>
    );
  }

  return (
    <ul className={styles.compareList}>
      {compareCompanies.map((company) => (
        <li key={company.id}>
          <CompanyCard
            image={company.imgUrl}
            name={company.name}
            category={company.category}
            onRemove={() => onRemove(company)}
          />
        </li>
      ))}
    </ul>
  );
}
