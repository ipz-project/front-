import { useCallback, useContext, useState } from "react";
import { Button, Input, Textarea } from "../../../../shared/components";
import { TalentsService } from "../../../../services/api-services";
import { UserContext } from "../../../../context/UserContext";
import s from "./AddingProofsForm.module.scss";
import plus from "../../../../shared/images/plus.svg";
import { validateLinks, validateText } from "./validate";

export function AddingProofsForm({
    id,
    token,
    edit = null,
    editProof = null,
    setEditProof = null,
    proof = null,
    setCancelModalIsOpen = null,
}) {
    const [activeProofs, setActiveProofs] = useState(edit !== null);
    const [link, setLink] = useState({ link: edit === null ? "" : proof.link, error: "", state: true });
    const [text, setText] = useState({ text: edit === null ? "" : proof.text, error: "", state: true });
    const [addProofError, setAddProofError] = useState("");
    const { talentsProofs, setTalentsProofs } = useContext(UserContext);

    const validateProof = useCallback(() => {
        setLink((prev) => ({
            ...prev,
            ...validateLinks(link.link),
        }));

        setText((prev) => ({
            ...prev,
            ...validateText(text.text),
        }));

        return validateLinks(link.link).state && validateText(text.text).state;
    }, [link, text]);

    function handle(e) {
        e.preventDefault();
        if (validateProof()) {
            const proof = { link: link.link, text: text.text };
            TalentsService.addProof(proof, id, token)
                .then(() => {
                    setTalentsProofs((prev) => [
                        ...prev,
                        {
                            id: NaN,
                            link: "string",
                            text: "string",
                            created: "date",
                            status: "DRAFT",
                        },
                    ]);
                    setActiveProofs(false);
                    setLink({ link: "", error: "", state: true });
                    setText({ text: "", error: "", state: true });
                    setAddProofError("");
                })
                .catch((error) => {
                    if (error.response.status === 400 || error.response.status === 500) {
                        setAddProofError("Incorrect link or description entered");
                    } else {
                        setAddProofError("Something goes wrong");
                    }
                });
        }
    }

    function save(e) {
        e.preventDefault();

        if (validateProof()) {
            const newProof = {
                link: link.link,
                text: text.text,
                status: proof.status,
                created: proof.created,
            };
            TalentsService.editProof(id, proof.id, newProof, token)
                .then(() => {
                    setTalentsProofs(
                        talentsProofs.map((obj) => {
                            if (obj.id === proof.id) {
                                return { id: proof.id, ...newProof };
                            }
                            return obj;
                        })
                    );
                    setEditProof(
                        editProof.map((obj) => {
                            if (obj.id === proof.id) {
                                return { ...obj, edit: false };
                            }
                            return obj;
                        })
                    );
                    setLink({ link: "", error: "", state: true });
                    setText({ text: "", error: "", state: true });
                    setAddProofError("");
                })
                .catch((error) => {
                    if (error.response.status === 400 || error.response.status === 500) {
                        setAddProofError("Incorrect link or description entered");
                    } else {
                        setAddProofError("Something goes wrong");
                    }
                });
        }
    }

    return (
        <>
            {edit === null ? (
                <div className={s.updating_proofs}>
                    <img
                        className={`${s.add} ${activeProofs ? s.rotated : ""}`}
                        onClick={() => {
                            setActiveProofs((prev) => !prev);
                            setLink({ link: "", error: "", state: true });
                            setText({ text: "", error: "", state: true });
                            setAddProofError("");
                        }}
                        src={plus}
                    ></img>
                </div>
            ) : (
                ""
            )}

            {activeProofs && (
                <form action="" className={s.add_proff_form}>
                    <div className={s.description}>
                        <Input
                            onChange={(e) =>
                                setLink((prev) => ({
                                    ...prev,
                                    link: e.target.value,
                                }))
                            }
                            value={link.link}
                            className={`${s.pr_link} ${link.state ? "" : s.error}`}
                            type="text"
                            placeholder="Paste only one link"
                            autoComplete="off"
                        />
                        <span className={s.error_msg}>{link.state ? "" : link.error}</span>

                        <div className={s.description_text}>
                            <Textarea
                                onChange={(e) =>
                                    setText((prev) => ({
                                        ...prev,
                                        text: e.target.value,
                                    }))
                                }
                                value={text.text}
                                className={`${s.pr_description} ${text.state ? "" : s.error}`}
                                placeholder="Write the description"
                                maxLength="255"
                            />
                            <span className={s.description_length}>{text.text.length}/255</span>
                            <span className={s.error_msg}>{text.state ? "" : text.error}</span>
                        </div>

                        <div className={s.btns}>
                            <span className={s.error_form}>{addProofError}</span>
                            {edit === null ? (
                                <Button className={s.btn} onClick={handle}>
                                    Create
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className={s.btn}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCancelModalIsOpen(true);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className={s.btn} onClick={save}>
                                        Save
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}
