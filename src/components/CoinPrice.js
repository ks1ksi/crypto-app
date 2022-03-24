import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { CircularProgress, Typography } from "@mui/material";

function CoinPrice({ coinId }) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoin = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(
        `https://api.coinstats.app/public/v1/markets?coinId=${coinId}`
      );
      // 가격순 정렬
      response.data.sort((a, b) => (a.price < b.price) ? -1 : 1)
      // 상위 20개
      setInfo(response.data.slice(0, 20));
      console.log(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoin();
  }, []);

  if (!info) return null;
  if (loading) return <CircularProgress />;
  if (error) return <div>에러</div>;
  return (
    <>
      {info.map((market) => (
        <Typography>
          {market.exchange}: {market.price}
        </Typography>
      ))}
    </>
  );
}

export default CoinPrice;
