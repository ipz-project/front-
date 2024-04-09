import { useEffect, useState } from "react";
import { TalentsService } from "../../../../../../services/api-services";
import s from "./ProfileProofBlock.module.scss";
import { handlerDropdown } from "./dropdown";

export function ProfileProofBlock({
    id,
    userID,
    token,
    link,
    text,
    status,
    created,
    talentsProofs,
    setTalentsProofs,
    editProof,
    setEditProof,
    setDeleteModalIsOpen,
    setProofID,
}) {
    window.onclick = (event) => {
        handlerDropdown(event, s.dropdown_content, s.show);
    };

    const [kudos, setKudos] = useState(0);
    useEffect(() => {
        TalentsService.getKudos(id, token)
            .then((kudos) => {
                setKudos(kudos.amount);
            })
            .catch((err) => console.log(err));
    }, []);
    function save(newStatus) {
        const newProof = {
            link: link,
            text: text,
            status: newStatus,
            created: created,
        };
        TalentsService.editProof(userID, id, newProof, token)
            .then(() => {
                setTalentsProofs(
                    talentsProofs.map((obj) => {
                        if (obj.id === id) {
                            return { id: id, ...newProof };
                        }
                        return obj;
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <div className={s.out}>
                <div className={s.proofs}>
                    <div className={s.info}>
                        <div className={s.settings}>
                            <button
                                className={s.dropbtn}
                                onClick={() => {
                                    setProofID(id);
                                }}
                            ></button>
                            <div id="cityDropdown" className={s.dropdown_content}>
                                {status === "DRAFT" ? (
                                    <button
                                        onClick={() => {
                                            setEditProof(
                                                editProof.map((obj) => {
                                                    return {
                                                        ...obj,
                                                        edit: obj.id === id,
                                                    };
                                                })
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    ""
                                )}
                                {status === "DRAFT" || status === "HIDDEN" ? (
                                    <button onClick={() => save("PUBLISHED")}>Publish</button>
                                ) : (
                                    ""
                                )}
                                {status === "PUBLISHED" ? <button onClick={() => save("HIDDEN")}>Hide</button> : ""}
                                <button onClick={() => setDeleteModalIsOpen(true)}>Delete</button>
                            </div>
                        </div>
                        <span className={s.status}>{status.toLocaleLowerCase()}</span>

                        <h1>Link:</h1>
                        <a className={s.link} href={link} target="_blank" rel="noreferrer">
                            Click to know me more
                        </a>
                        <div className={s.proof_description}>
                            <div className={s.title}>Description:</div>
                            <p>{text}</p>
                        </div>
                    </div>
                    <div className={s.date}>
                        <div className={s.kudos_block}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                color="#676767"
                                width="35"
                                height="35"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                                className={s.kudos}
                            >
                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />{" "}
                            </svg>
                            <div className={s.count}>{kudos} </div>
                        </div>
                        <b className={s.created}>Created: {created.split(" ")[0]}</b>
                    </div>
                </div>
            </div>
        </>
    );
}
