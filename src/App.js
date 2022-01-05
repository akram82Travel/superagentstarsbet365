import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { Table } from "react-bootstrap";
import Clock from "react-digital-clock";

function App() {
  const date_show = new Date().toISOString().slice(0, 10).replace("T", " ");
  const year = new Date().toISOString().slice(0, 4).replace("T", " ");
  const dataAll = [];
  const [jwt, setjwt] = useState("");
  const [userid, setUserid] = useState("");
  const [showAgent, setShowagent] = useState(false);

  //search var
  const inputRef = useRef();
  const dateoneRef = useRef();
  const datetwoRef = useRef();

  //connexion input
  const loginRef = useRef();
  const passwordRef = useRef();

  const [userValue, setUserValue] = useState(0);
  const [dateone, setDateone] = useState(date_show);
  const [datetwo, setDatetwo] = useState(date_show);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // search setup
  const updateOutput = () => {
    setUserValue(inputRef.current.value);
    setDateone(dateoneRef.current.value);
    setDatetwo(datetwoRef.current.value);
  };

  //login setup
  const updateConnexionParams = () => {
    setLogin(loginRef.current.value);
    setPassword(passwordRef.current.value);
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const updateConnexion = () => {
    let formData = new FormData();

    formData.append("login", login); //sfax1
    formData.append("password", password);
    setLoading(true); //startbet -> sihem251279 //torobet -> sihem2512
    axios({
      method: "POST",
      url:
        "https://allow-crs.herokuapp.com/https://www.starsbet365.com/platform-api/auth/login",
      data: formData,
      headers: { "Access-Control-Allow-Origin": "*" }
    })
      .then((response) => response.data)
      .then((responseData) => {
        if (responseData.errors) {
          setMessage(responseData.errors[0].message);
        } else {
          setMessage("");
          setjwt(responseData.jwt);
          var api =
            "https://allow-crs.herokuapp.com/https://www.starsbet365.com/platform-api-v2/hierarchy/get-direct-children";
          //var api = "https://thingproxy.freeboard.io/fetch/https://www.starsbet365.com/platform-api-v2/hierarchy/get-direct-children";
          var token = responseData.jwt;
          axios({
            method: "GET",
            url: api,
            headers: {
              authorization: "Bearer " + token,
              "Access-Control-Allow-Origin": "*"
            }
          })
            .then((response) => response.data)
            .then((responseData) => {
              responseData.map((answer, i) => {
                dataAll.push(answer);
              });
              setPosts(dataAll);
            })
            .catch((err) => {
              console.log(err);
            });
          // set code super agent
          var apisupag =
            "https://allow-crs.herokuapp.com/https://www.starsbet365.com/platform-api/player/details";
          //var api = "https://thingproxy.freeboard.io/fetch/https://www.torobet365.com/platform-api-v2/hierarchy/get-direct-children";
          var tokensupag = responseData.jwt;
          axios({
            method: "GET",
            url: apisupag,
            headers: {
              authorization: "Bearer " + token,
              "Access-Control-Allow-Origin": "*"
            }
          })
            .then((response) => response.data)
            .then((responseData) => {
              if (responseData.errors) {
                setMessage(responseData.errors[0].message);
              } else {
                setMessage("");
                setUserid(responseData.user_id);
              }
            })
            .catch((err) => {
              console.log(err);
            });
          setShowagent(true);
        }
      });
  };
  const ListOfAgentsTable = () => {
    // return table of alla agents
    return (
      <table className="table-bordered w-100" border="1">
        <thead>
          <tr>
            <th>Agent Name</th>
            <th>Agent code</th>
            <th>#</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.userId}>
              <td align="left">{post.username}</td>
              <td>{post.userId}</td>
              <td
                align="left"
                className="button"
                onClick={() => {
                  setUserValue(post.userId);
                }}
              >
                <button className="btn btn-info">Recette</button>
              </td>
            </tr>
          ))}
        </tbody>

        <tfoot></tfoot>
      </table>
    );
  };

  const DataFetching = () => {
    const [postsData, setPostsData] = useState([]);
    const [id, setId] = useState(0);
    //const [dateone, setDateone] = useState("")
    //const [datetwo, setDatetwo] = useState("")
    const [idFromButonClick, setIdFromBytonClick] = useState(0);
    const [datestart, setDatestart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [amountWithdrow, setamountWithdrow] = useState([]);
    const [amountDeposite, setAmountDeposite] = useState([]);
    const [ligne, setLigne] = useState([]);
    const [lignew, setLigneW] = useState([]);
    const [solde, setSolde] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingShow, setLoadingShow] = useState(false);
    const handleClick = () => {
      setDatestart(dateone);
      setDateEnd(datetwo);
      setIdFromBytonClick(userValue);
    };
    let formData = new FormData();
    formData.append("dateFrom", dateone);
    formData.append("dateTo", datetwo);
    formData.append("userId", userValue); //code hatem : 3350 // code hammadi: 3367

    useEffect(() => {
      setLoading(true);
      setLoadingShow(true);
      axios({
        method: "POST",
        url:
          "https://allow-crs.herokuapp.com/https://www.starsbet365.com/agent-api/transactions/financial",
        data: formData,
        headers: { "Access-Control-Allow-Origin": "*" }
      })
        .then((response) => response.data)
        .then((responseData) => {
          var filtredResult = responseData.filter(
            (i) => i.fromUserId !== userValue
          );
          filtredResult = filtredResult.filter((i) => i.fromUserId !== userid);
          filtredResult = filtredResult.filter((i) => i.fromUserId !== "2673");

          var filtredResultDeposite = responseData.filter(
            (i) => i.fromUserId === userValue
          );
          filtredResultDeposite = filtredResultDeposite.filter(
            (i) => i.toUserId !== userid
          );
          filtredResultDeposite = filtredResultDeposite.filter(
            (i) => i.toUserId !== "2673"
          );

          setPostsData(filtredResult);
          var amount = 0;
          var ligneallW = 0;
          filtredResult.map((answer, i) => {
            amount += parseInt(answer.amount);
            setamountWithdrow(amount);
            ligneallW += 1;
            setLigneW(ligneallW);
          });
          var amountDep = 0;
          var ligneall = 0;
          filtredResultDeposite.map((answer, i) => {
            amountDep += parseInt(answer.amount);
            setAmountDeposite(amountDep);
            ligneall += 1;
            setLigne(ligneall);
          });
          setLoading(false);
          setLoadingShow(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }, [idFromButonClick]);
    // return table of alla agents

    return (
      <div className="row">
        <div className="col-md-12">
          {loading && (
            <div className="spinner-border text-warning" role="status"></div>
          )}
        </div>
        {!loadingShow && (
          <div>
            <div className="text-info text-center">
              Agent:{" "}
              <b>
                {posts.map((post) => (
                  <span key={post.userId}>
                    {post.userId === userValue ? post.username : ""}
                  </span>
                ))}
              </b>
            </div>
            <br></br>
            <div className="alert alert-dark">
              TOTAL DEPOSITE = TND{" "}
              <b>
                {(amountDeposite * 1.2) / 100} ({ligne} transfert)
              </b>
            </div>
            <div className="alert alert-warning">
              TOTAL WITHDROWS = TND{" "}
              <b>
                {amountWithdrow / 100} ({lignew} transfert)
              </b>
            </div>
            <div className="alert alert-success">
              RECETTE = TND{" "}
              <b>
                {
                  /*Math.round(
                  (amountDeposite * 1.2) / 100 - amountWithdrow / 100
                )*/ (
                    (amountDeposite * 1.2) / 100 -
                    amountWithdrow / 100
                  ).toFixed(1)
                }
              </b>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header container">
        <img
          src="https://www.starsbet365.com/remote-assets/logo.png?1603106051"
          alt="logo"
        />
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossorigin="anonymous"
        />
        <br />{" "}
        <h4>
          Recette: {date_show} <Clock />
        </h4>
        <div className="row">
          <div className="col-md-5">
            <input
              ref={loginRef}
              placeholder="login"
              className="form-control"
              onChange={updateConnexionParams}
              type="text"
            ></input>
          </div>
          <div className="col-md-5">
            <input
              ref={passwordRef}
              placeholder="mot de passe"
              className="form-control"
              onChange={updateConnexionParams}
              type="password"
            ></input>
          </div>
          <div className="col-md-2">
            <button className="btn btn-success" onClick={updateConnexion}>
              Connexion
            </button>
          </div>
          <hr></hr>
          <div className="col-md-12">
            <small>
              <span className="text-danger">{message}</span>
            </small>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 col-sm-12 mb-4 mt-4">
            <label>Caisse pour le jour: </label>
            <input
              ref={dateoneRef}
              type="date"
              className="form-control"
              value={dateone}
              onChange={updateOutput}
            />
          </div>
          <div className="col-lg-12 col-sm-12 mb-4 mt-4">
            <input
              ref={datetwoRef}
              type="date"
              className="form-control"
              value={datetwo}
              onChange={updateOutput}
            />
          </div>
        </div>
        <input
          ref={inputRef}
          value={userValue}
          type="hidden"
          onChange={updateOutput}
        ></input>
        <div className="row">
          {showAgent && (
            <div className="col-md-6">
              <DataFetching />
            </div>
          )}
          {showAgent && (
            <div className="col-md-6">
              <ListOfAgentsTable />
            </div>
          )}
        </div>
      </header>
      <hr></hr>

      <footer className="p-4 text-white">
        <h6 className="p-4 text-white">
          Recette agents <i>Version 2.1</i>
        </h6>
        Copy right {year} Powered by{" "}
        <span className="text-warning">
          <b>Sagrada Soft</b>
        </span>
      </footer>
    </div>
  );
}
export default App;
