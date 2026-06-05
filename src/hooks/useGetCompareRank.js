import { useEffect, useState } from "react";
import compareService from "@/services/compareResultService";

export default function useGetCompareRank(options = {}) {
  const [compareRankList, setCompareRankList] = useState([]);
  const { myStartupId, orderBy } = options;

  useEffect(() => {
    const params = new URLSearchParams({
      orderBy: "totalInvestment_desc",
    });
    if (myStartupId !== undefined) params.set("myStartupId", myStartupId);
    if (orderBy !== undefined) params.set("orderBy", orderBy);

    async function fetchGetResult() {
      try {
        const result = await compareService.getCompareRankList(params);
        console.log(`log : ${result.nearbyStartups}`);
        setCompareRankList(result.nearbyStartups);
      } catch (error) {
        console.error(`HTTP GetCompareRankList : ${error.message}`);
      }
    }
    fetchGetResult();
  }, [myStartupId, orderBy]);

  return { compareRankList };
}
