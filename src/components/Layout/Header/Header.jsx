import { useCallback, useContext, useMemo, useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import s from "./Header.module.scss";
import { Button } from "../../../shared/components";
import { UserContext } from "../../../context/UserContext";
import { useCookies } from "react-cookie"; // temp
import { TalentsService } from "../../../services/api-services";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const editPath = useCallback(() => {
    return location.pathname + location.search + "#auth";
  }, [location]);

  const { auth, user, token, userInfo, setUserInfo } = useContext(UserContext);

  const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);

  useEffect(() => {
    if (user.id) {
      TalentsService.getTalent(user.id, token)
        .then((response) => {
          setUserInfo(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user.id]);
  const menuItems = useMemo(
    () => [
      // { title: "Home", link: "/" },
      { title: "Talents", link: "/talents" },
      { title: "Proofs", link: "/proofs" },
    ],
    []
  );

  return (
    <header className={s.header}>
      <div className="__container">
        <Link to="/" className={s.logo}>
          IT<span>Hunt</span>
        </Link>
        <nav className={s.nav}>
          {menuItems.map(({ title, link }, index) => (
            <NavLink
              to={link}
              key={index}
              className={({ isActive }) => {
                return isActive ? s.active : "";
              }}
            >
              {title}
            </NavLink>
          ))}
        </nav>
        <div className={s.btns}>
          {!auth ? (
            <Button
              className={s.btn}
              onClick={() => {
                navigate(editPath(), { replace: true });
              }}
            >
              Login / Register
            </Button>
          ) : (
            <>
              <Link to="/profile" className={s.username}>
                {userInfo?.first_name && userInfo?.last_name
                  ? userInfo?.first_name + " " + userInfo?.last_name
                  : ""}
              </Link>
              <Button
                className={s.btn}
                onClick={() => {
                  removeCookie("token");
                  removeCookie("user");
                  navigate("/", { replace: true });
                  setUserInfo({});
                }}
              >
                Log Out
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
