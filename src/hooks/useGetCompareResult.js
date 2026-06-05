import { useEffect, useState } from "react";
import compareService from "@/services/compareResultService";

export default function useGetCompareResult(options = {}) {
  const [compareResultList, setCompareResultList] = useState([]);
  const [myStartup, setMystartup] = useState({});
  const { myStartupId, compareStartupIds, orderBy } = options;
  const compareStartupIdsStr = Array.isArray(compareStartupIds)
    ? compareStartupIds.join(",")
    : String(compareStartupIds ?? "");

  useEffect(() => {
    const params = new URLSearchParams({
      orderBy: "totalInvestment_desc",
    });
    if (myStartupId !== undefined) params.set("myStartupId", myStartupId);
    if (orderBy !== undefined) params.set("orderBy", orderBy);

    if (compareStartupIdsStr) {
      compareStartupIdsStr.split(",").forEach((id) => {
        if (id) params.append("compareStartupIds", id);
      });
    }

    async function fetchGetResult() {
      try {
        const result = await compareService.getCompareList(params);
        setMystartup(result.myStartup);
        setCompareResultList(result.compareStartups);
      } catch (error) {
        console.error(`HTTP GetCompareResult : ${error.message}`);
      }
    }
    fetchGetResult();
  }, [myStartupId, compareStartupIdsStr, orderBy]);

  return { myStartup, compareResultList };
}
