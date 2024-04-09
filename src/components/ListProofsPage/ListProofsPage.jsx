import { TalentsService } from "../../services/api-services";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { ProofBlock } from "../TalentPage/components/ListProofs/components/ProofBlock";
import { Button } from "../../shared/components";
import { Pagination } from "../TalentsListPage/components/Pagination";
import s from "./ListProofsPage.module.scss";

export function ListProofsPage() {
    const [proofs, setProofs] = useState({});
    const { user } = useContext(UserContext);
    const { token } = useContext(UserContext);
    const { talentsProofs, setTalentsProofs } = useContext(UserContext);
    const [pages, setPages] = useState({ page: 0, size: 5, orderBy: "desc" });
    const [countOfPages, setCountOfPages] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    useEffect(() => {
        if (user.id) {
            TalentsService.getProofs(user.id, token)
                .then((proofs) => {
                    setTalentsProofs(proofs.content);
                })
                .catch((err) => console.log(err));
        }
    }, [token, talentsProofs?.length, setTalentsProofs]);
    useEffect(() => {
        if (searchParams.has("page") && searchParams.has("size")) {
            if (
                Number(searchParams.get("page")) < 0 ||
                Number(searchParams.get("page")) > countOfPages ||
                Number(searchParams.get("size")) <= 0
            ) {
                let sParams = {};
                sParams.page = page;
                sParams.size = size;
                setSearchParams(sParams, { replace: true });
            } else {
                setPage(Number(searchParams.get("page")));
                setSize(Number(searchParams.get("size")));
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (!searchParams.has("page") || !searchParams.has("size")) {
            let sParams = {};
            sParams.page = page;
            sParams.size = size;
            setSearchParams(sParams, { replace: true });
        }
    }, [page, searchParams, size]);

    useEffect(() => {
        if (0 < page < countOfPages) {
            TalentsService.getAllProofs(
                searchParams.get("page") || "",
                pages.size,
                pages.orderBy
            ).then((res) => {
                setProofs(res.content);
                setCountOfPages(res.total_pages);
            });
        } else {
            TalentsService.getAllProofs(0, pages.size, pages.orderBy).then(
                (res) => {
                    setProofs(res.content);
                    setCountOfPages(res.total_pages);
                }
            );
        }
    }, [pages, page, size]);

    const filterByDateAsc = () => {
        setPages({ ...pages, orderBy: "asc" });
    };

    const filterByDateDesc = () => {
        setPages({ ...pages, orderBy: "desc" });
    };

    return (
        <div>
            <div className={s.buttons}>
                <Button className={s.button} onClick={filterByDateDesc}>
                    Sort by date: ascending
                </Button>
                <Button className={s.button} onClick={filterByDateAsc}>
                    Sort by date: descending
                </Button>
            </div>

            {proofs.length > 0 ? (
                proofs.map((el) => {
                    return (
                        <ProofBlock
                            key={el.id}
                            id={el.id}
                            link={el.link}
                            text={el.text}
                            created={el.created}
                            status={el.status}
                            myProofs={[...talentsProofs]}
                        />
                    );
                })
            ) : (
                <div></div>
            )}
            <Pagination
                countOfPages={countOfPages}
                page={page}
                size={pages.size}
                path={"proofs"}
            />
        </div>
    );
}
