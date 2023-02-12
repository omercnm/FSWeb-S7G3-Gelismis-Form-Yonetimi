import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import styled from "styled-components";

const Sc_fieldset = styled.fieldset`
  display: flex;
  justify-content: space-evenly;
  margin: auto, 250 px;
  color: darkslategray;
  font-family: "Roboto Mono", monospace;
  font-weight: bolder;
  #KullanimSartlari {
    font-size: 12px;
    font-weight: lighter;
  }
`;

const userSchema = Yup.object().shape({
  isim: Yup.string()
    .min(3, "Çok kısa!")
    .max(10, "Çok uzun!")
    .required("Bu bilgi gereklidir"),
  eposta: Yup.string()
    .email("Geçersiz Eposta adresi")
    .required("Bu bilgi gereklidir"),

  sifre: Yup.string()
    .min(3, "Çok kısa !")
    .max(10, "Çok uzun!")
    .required("Bu bilgi gereklidir"),
  sartlar: Yup.boolean().oneOf(
    [true],
    "Kullanım şartları ve gizlilik politikasını kabul etmeniz gerekmektedir."
  ),
});

export default function Form() {
  const [data, setData] = useState({
    isim: "",
    eposta: "",
    sifre: "",
    sartlar: false,
  });

  const [disabledMi, setDisabledMi] = useState(true);
  const [errors, setErrors] = useState({
    isim: "",
    eposta: "",
    sifre: "",
    sartlar: "",
  });
  useEffect(() => {
    userSchema.isValid(data).then((valid) => setDisabledMi(!valid));
  }, [data]);

  const checkFormErrors = (name, value) => {
    Yup.reach(userSchema, name)
      .validate(value)
      .then(() => {
        setErrors({
          ...errors,
          [name]: "",
        });
      })
      .catch((err) => {
        setErrors({
          ...errors,
          [name]: err.errors[0],
        });
      });
  };

  function handleChange(e) {
    let valueTouse =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    checkFormErrors(e.target.name, valueTouse);
    setData({ ...data, [e.target.name]: valueTouse });
    console.log(errors);
  }
  function handleSubmit(event) {
    event.preventDefault();
    console.log(data);
    console.log("Submitted!");

    axios
      .post("https://reqres.in/api/users", data)
      .then((res) => {
        console.log("sucess", res);
      })
      .catch((err) => console.log(err.response));
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <Sc_fieldset>
            <legend>Kayıt Formu</legend>
            <p>
              <label htmlFor="Name">İsim-Soyisim*</label>
              <input
                id="Name"
                onChange={handleChange}
                value={data.isim}
                name="isim"
                type="text"
              ></input>
            </p>
            {errors.isim !== "" && (
              <div id="KullanimSartlari" style={{ color: "red", fontSize: 12 }}>
                {errors.isim}
              </div>
            )}
            <p>
              <label htmlFor="Email">Eposta Adresi*</label>
              <input
                id="Email"
                onChange={handleChange}
                value={data.eposta}
                name="eposta"
                type="text"
              ></input>
            </p>
            {errors.eposta !== "" && (
              <div id="KullanimSartlari" style={{ color: "red", fontSize: 12 }}>
                {errors.eposta}
              </div>
            )}
            <p>
              <label htmlFor="Password">Şifre*</label>
              <input
                id="Password"
                onChange={handleChange}
                value={data.sifre}
                name="sifre"
                type="password"
              ></input>
            </p>
            {errors.sifre !== "" && (
              <div id="KullanimSartlari" style={{ color: "red", fontSize: 12 }}>
                {errors.sifre}
              </div>
            )}
            <p>
              <label
                id="KullanimSartlari"
                htmlFor="KullanimSartlari"
                value={data.sartlar}
              >
                Kullanım şartları ve gizlilik politikası*
              </label>
              {errors.sartlar !== "" && (
                <div
                  id="KullanimSartlari"
                  style={{ color: "red", fontSize: 12 }}
                >
                  {errors.sartlar}
                </div>
              )}
              <input
                type="checkbox"
                onChange={handleChange}
                checked={data.sartlar}
                name="sartlar"
                id="KullanimSartlari"
              ></input>
            </p>
            <p>
              <button type="submit" disabled={disabledMi}>
                Gönder
              </button>
            </p>
          </Sc_fieldset>
        </form>
      </div>
    </div>
  );
}
