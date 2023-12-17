import { useEffect, useState } from "react";

export default function App() {
  const [currencies, setCurrencies] = useState({});
  const [from, setFrom] = useState("USD");
  const [curNumber, setCurNumber] = useState(1);
  const [to, setTo] = useState("INR");
  const [converted, setConverted] = useState("");

  useEffect(function () {
    async function getCurrencies() {
      const res = await fetch("https://api.frankfurter.app/currencies");
      const data = await res.json();
      setCurrencies(data);
    }

    getCurrencies();

    return function () {
      setCurrencies({});
    };
  }, []);

  useEffect(
    function () {
      async function getConversion() {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${curNumber}&from=${from}&to=${to}`
        );

        const data = await res.json();
        setConverted(data.rates[to]);
      }
      if (curNumber !== "" && curNumber !== 0) {
        getConversion();
      }
    },
    [from, curNumber, to]
  );

  return (
    <div>
      <Input setCurNumber={setCurNumber} curNumber={curNumber} />
      <DropDown
        curSelected={from}
        setCurSelected={setFrom}
        currencies={currencies}
        alreadySelect={to}
      />
      <DropDown
        curSelected={to}
        setCurSelected={setTo}
        currencies={currencies}
        alreadySelect={from}
      />

      <h2>
        {converted} {to}
      </h2>
    </div>
  );
}

function DropDown({ curSelected, setCurSelected, currencies, alreadySelect }) {
  const filterCurrency = { ...currencies };
  delete filterCurrency?.[alreadySelect];

  return (
    <select
      value={curSelected}
      onChange={(e) => {
        setCurSelected(e.target.value);
      }}
    >
      {Object.entries(filterCurrency).map(([currency, fullname]) => {
        return (
          <option value={currency} key={currency}>
            {fullname}
          </option>
        );
      })}
    </select>
  );
}

function Input({ setCurNumber, curNumber }) {
  return (
    <input
      type="number"
      onChange={(e) => {
        if (e.target.value.trim() === "") {
          setCurNumber("");
          return;
        }
        const amount = Number(e.target.value);
        setCurNumber(amount);
      }}
      value={curNumber}
    ></input>
  );
}
