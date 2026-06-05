import { useEffect, useState } from "react";
import MyCompanyApi from "@/services/myCompanyService";

const company = new MyCompanyApi();

export function useGetStartupList(options = {}) {
  const [companyList, setCompanyList] = useState([]);
  const [pagination, setPagination] = useState({});
  const { page, limit, orderBy, search, myStartupId } = options;

  useEffect(() => {
    const params = new URLSearchParams({
      page: 1,
      limit: 10,
      orderBy: "desc",
      search: "",
    });

    if (page !== undefined) params.set("page", page);
    if (limit !== undefined) params.set("limit", limit);
    if (orderBy !== undefined) params.set("orderBy", orderBy);
    if (search !== undefined) params.set("search", search);
    if (myStartupId !== undefined) params.set("myStartupId", myStartupId);

    if (!myStartupId) {
      params.delete("myStartupId");
    }

    async function getApi() {
      try {
        const result = await company.getCompanyList(params);
        setCompanyList(result.data);
        setPagination(result.pagination);
      } catch (error) {
        console.error(error.message);
      }
    }
    getApi();
  }, [orderBy, limit, search, page, myStartupId]);

  return { companyList, pagination };
}
