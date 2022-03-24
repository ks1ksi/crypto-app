import { useEffect, useState } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { CardActionArea, LinearProgress } from "@mui/material";
import Fade from "@mui/material/Fade";
import CoinPrice from "./CoinPrice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function Coins() {
  const [coins, setCoins] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [coin, setCoin] = useState(null);

  const fetchCoins = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get(
        "https://api.coinstats.app/public/v1/coins?skip=0&limit=100&currency=EUR"
      );
      setCoins(response.data.coins);
      console.log(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  if (loading)
    return (
      <Box sx={{ width: "100%" }}>
        <LinearProgress />
      </Box>
    );
  if (error) return <div>에러</div>;
  if (!coins) return null;
  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => setOpen(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <CoinPrice coinId={coin} />
          </Box>
        </Fade>
      </Modal>

      <Grid container>
        {coins.map((coin) => (
          <Card
            onClick={() => {
              setCoin(coin.id);
              setOpen(true);
            }}
            key={coin.id}
            sx={{ maxWidth: 345, mb: 3 }}
          >
            <CardActionArea>
              <CardMedia
                component="img"
                height="140"
                image={coin.icon}
                alt={coin.id}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {coin.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {coin.price.toPrecision(10)}USD
                </Typography>
                {/* <Typography variant="body2" color="text.secondary">
                {coin.priceBtc.toPrecision(10)}BTC
              </Typography> */}
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Grid>
    </>
  );
}

export default Coins;
