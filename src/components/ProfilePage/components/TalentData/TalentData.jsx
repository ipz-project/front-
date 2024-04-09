import React, {
    useCallback,
    forwardRef,
    useImperativeHandle,
    useContext,
} from "react";
import { Input, Button } from "../../../../shared/components";
import userAvatar from "../../../../shared/images/user.png";
import plus from "./images/plus.svg";
import linkedin from "../../../../shared/images/linkedin.svg";
import github from "../../../../shared/images/github.svg";

import s from "./TalentData.module.scss";
import {
    validateFirstName,
    validateLastName,
    validateLinks,
    validateSpecialization,
    validateTalent,
} from "./validate";
import { Links } from "./components/Links";

export const TalentData = forwardRef((props, ref) => {
    const {
        profile,
        editting,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        specialization,
        setSpecialization,
        talent,
        setTalent,
        allTalents,
        setAllTalents,
        links,
        setLinks,
    } = props;

    const valideTalentData = useCallback(() => {
        setFirstName((prev) => ({
            ...prev,
            ...validateFirstName(firstName.name),
        }));
        setLastName((prev) => ({
            ...prev,
            ...validateLastName(lastName.name),
        }));

        setSpecialization((prev) => ({
            ...prev,
            ...validateSpecialization(specialization.spec),
        }));

        setLinks(
            links.map((obj) => {
                if (validateLinks(links).includes(obj.id)) {
                    return { ...obj, error: "*not valid link", state: false };
                }
                return obj;
            })
        );
        return (
            validateFirstName(firstName.name).state &&
            validateLastName(lastName.name).state &&
            validateSpecialization(specialization.spec).state &&
            validateLinks(links).length === 0
        );
    }, [firstName, lastName, specialization, links]);

    useImperativeHandle(
        ref,
        () => ({
            validate: () => {
                return valideTalentData();
            },
        }),
        [valideTalentData]
    );

    function addTalent() {
        setTalent((prev) => ({
            ...prev,
            ...validateTalent(talent.talent),
        }));
        if (validateTalent(talent.talent).state) {
            setAllTalents((prev) => [
                ...prev,
                talent.talent.replace(/\s+/g, " ").trim(),
            ]);
            setTalent({ talent: "", error: "", state: true });
        }
    }

    return (
        <div className={s.talent_data}>
            <img
                className={s.ava}
                src={profile.image ? profile.image : userAvatar}
                alt="avatar"
            />
            <div>
                <div className={s.name}>
                    {editting ? (
                        <>
                            <div className={s.input_block}>
                                <Input
                                    type="text"
                                    value={firstName.name}
                                    placeholder="first name"
                                    autoComplete="off"
                                    className={`${
                                        firstName.state ? "" : s.error
                                    }`}
                                    onChange={(event) =>
                                        setFirstName((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                                <span>
                                    {firstName.state ? "" : firstName.error}
                                </span>
                            </div>
                            <div className={s.input_block}>
                                <Input
                                    type="text"
                                    value={lastName.name}
                                    placeholder="last name"
                                    autoComplete="off"
                                    className={`${
                                        lastName.state ? "" : s.error
                                    }`}
                                    onChange={(event) =>
                                        setLastName((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                                <span>
                                    {lastName.state ? "" : lastName.error}
                                </span>
                            </div>
                        </>
                    ) : (
                        `${profile.first_name} ${profile.last_name}`
                    )}
                </div>

                <div className={s.specialization}>
                    {editting ? (
                        <div className={s.input_block}>
                            <Input
                                type="text"
                                value={specialization.spec}
                                placeholder="specialization"
                                autoComplete="off"
                                className={`${
                                    specialization.state ? "" : s.error
                                }`}
                                onChange={(event) =>
                                    setSpecialization((prev) => ({
                                        ...prev,
                                        spec: event.target.value,
                                    }))
                                }
                            />
                            <span>
                                {specialization.state
                                    ? ""
                                    : specialization.error}
                            </span>
                        </div>
                    ) : (
                        <p>{profile?.specialization}</p>
                    )}
                </div>

                <div
                    className={`${s.talents} ${editting ? s.talents_edit : ""}`}
                >
                    {editting ? (
                        <>
                            <div className={s.input_block}>
                                <div className={s.input_add}>
                                    <Input
                                        type="text"
                                        value={talent.talent}
                                        placeholder="talent"
                                        autoComplete="off"
                                        className={`${
                                            talent.state ? "" : s.error
                                        }`}
                                        onChange={(event) =>
                                            setTalent((prev) => ({
                                                ...prev,
                                                talent: event.target.value,
                                            }))
                                        }
                                    />
                                    <Button
                                        onClick={addTalent}
                                        disabled={allTalents.length >= 12}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <span>{talent.state ? "" : talent.error}</span>
                            </div>
                            {allTalents.length >= 1 ? <h3>Talents</h3> : ""}
                            <ul>
                                {allTalents.map((el, index) => (
                                    <li key={index}>
                                        {el}{" "}
                                        <button
                                            onClick={() =>
                                                setAllTalents(
                                                    allTalents.filter(
                                                        (_, i) => i !== index
                                                    )
                                                )
                                            }
                                        ></button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        profile.talents?.map((talent, index) => (
                            <div className={s.talent} key={index}>
                                {talent}
                            </div>
                        ))
                    )}
                </div>
                <div className={s.links}>
                    {editting ? (
                        <>
                            {links.map((el) => (
                                <Links
                                    links={links}
                                    setLinks={setLinks}
                                    el={el}
                                    key={el.id}
                                />
                            ))}
                            <button
                                disabled={links.length >= 7}
                                className={s.add}
                                onClick={() =>
                                    setLinks((prev) => [
                                        ...prev,
                                        {
                                            id: links[links.length - 1].id + 1,
                                            link: "",
                                            error: "",
                                            state: true,
                                        },
                                    ])
                                }
                            >
                                <img src={plus} alt="+" />
                            </button>
                        </>
                    ) : (
                        profile.links?.map((link, talent) => (
                            <a className={s.link} href={link} key={talent}>
                                {link.includes("linkedin") ? (
                                    <img
                                        className={s.socials}
                                        src={linkedin}
                                        alt=" media icon"
                                    />
                                ) : (
                                    <img
                                        className={s.socials}
                                        src={github}
                                        alt=" media icon"
                                    />
                                )}
                            </a>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
});
