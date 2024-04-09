import { ProofBlock } from "./components/ProofBlock";
import { TalentsService } from "../../../../services/api-services";
import { useTalent } from "../../../../hooks/useTalent";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import s from "./ListProofs.module.scss";
export function ListProofs({ id }) {
    const { token, talentsProofs, setTalentsProofs } = useContext(UserContext);

    const [size, setSize] = useState();

    useEffect(() => {
        TalentsService.getProofs(id, token, size)
            .then((proofs) => {
                setTalentsProofs(proofs.content);
                setSize(
                    proofs.total_elements === 0 ? 5 : proofs.total_elements
                );

            })
            .catch((err) => console.log(err));
    }, [talentsProofs.length]);

    return (
        <>
            {talentsProofs.length > 0 ? (
                <div>
                    {talentsProofs.map((el) => {
                        return (
                            <ProofBlock
                                key={el.id}
                                id={el.id}
                                link={el.link}
                                text={el.text}
                                created={el.created}
                                status={el.status}
                            />
                        );
                    })}
                </div>
            ) : (
                <span>
                    <div className={s.no_proofs}>No proofs yet!</div>
                </span>
            )}
        </>
    );
}
