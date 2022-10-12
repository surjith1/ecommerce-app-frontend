import { useEffect, useState } from "react";
import {
  Grid,
  Stack,
  Typography,
  Slider,
  Button,
  Checkbox,
  Rating,
  FormGroup,
  FormControlLabel,
} from "@mui/material";
import Appbar from "./Appbar";
import axios from "axios";
import { API_PRODUCTS } from "../Utilities";
import { useHistory } from "react-router-dom";

export default function ProductsView() {
  const ASC = "asc";
  const DESC = "desc";

  const history = useHistory();
  const [price, setPrice] = useState([100, 500]);
  const [minMax, setMinMax] = useState([100, 500]);
  const minPriceDiff = 10;
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const authToken = localStorage.getItem("auth-token");

  const handleChangePrice = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    if (activeThumb === 0) {
      setPrice([Math.min(newValue[0], price[1] - minPriceDiff), price[1]]);
    } else {
      setPrice([price[0], Math.max(newValue[1], price[0] + minPriceDiff)]);
    }
  };

  // const handleRatingClick=(star)=>{
  //     const currentIndex = checked.indexOf(star);
  //     const newChecked = [...checked];

  //     if (currentIndex === -1) {
  //       newChecked.push(star);
  //     } else {
  //       newChecked.splice(currentIndex, 1);
  //     }

  //     setChecked(newChecked);
  //     console.log(checked);
  // }

  const calculateDiscountPercentage = (price, salePrice) =>
    ((100 * (price - salePrice)) / price).toFixed();

  const filterDataByPrice = () => {
    let fileteredData = products.filter((product) => {
      return product.salePrice >= price[0] && product.salePrice <= price[1];
    });
    setProducts(fileteredData);
  };

  const sortASC = (a, b) => {
    if (a.salePrice < b.salePrice) {
      return -1;
    }
    if (a.salePrice > b.salePrice) {
      return 1;
    }
    return 0;
  };

  const sortDESC = (a, b) => {
    if (a.salePrice > b.salePrice) {
      return -1;
    }
    if (a.salePrice < b.salePrice) {
      return 1;
    }
    return 0;
  };

  const sortData = async (type) => {
    let sorted = [];
    if (type === ASC) {
      sorted = await products.sort(sortASC);
      setProducts(sorted);
      filterDataByPrice();
    } else if (type === DESC) {
      sorted = await products.sort(sortDESC);
      setProducts(sorted);
      filterDataByPrice();
    }
  };

  const freeDeliveryChecked = (event) => {
    if (event.target.checked) {
      let filteredData = products.filter((product) => {
        return product.deliveryCharge <= 0;
      });
      setProducts(filteredData);
    } else {
      setProducts(originalProducts);
    }
  };

  const assuredChecked = (event) => {
    if (event.target.checked) {
      let filteredData = products.filter((product) => {
        return product.assured === "yes";
      });
      setProducts(filteredData);
    } else {
      setProducts(originalProducts);
    }
  };

  const resetOriginalData = () => setProducts(originalProducts);

  useEffect(() => {
    async function getProducts() {
      await axios
        .get(`${API_PRODUCTS}`, {
          headers: { auth: authToken },
        })
        .then(function (res) {
          if (res.data) {
            setProducts(res.data);
            setOriginalProducts(res.data);
          }
        })
        .catch(function (err) {
          console.log(err.response);
        });
    }

    getProducts();
  }, [authToken]);

  useEffect(() => {
    function setPriceLimits() {
      let prices = [];
      let minMax = [0, 0];
      products.map((product) => {
        prices.push(parseInt(product.salePrice));
        minMax[0] = prices.reduce(function (a, b) {
          return Math.min(a, b);
        });
        minMax[1] = prices.reduce(function (a, b) {
          return Math.max(a, b);
        });
        return minMax;
      });

      setMinMax(minMax);
      setPrice(minMax);
    }

    setPriceLimits();
  }, [products]);

  return (
    <>
      <Grid sx={{ backgroundColor: "#f0f2f5" }}>
        <Appbar />
        <Stack direction="row">
          <Stack
            margin={1}
            spacing={1}
            minWidth={200}
            padding={1}
            backgroundColor="white"
          >
            <Typography sx={{ fontWeight: "bold" }}>Filters</Typography>
            <hr />
            <Typography>DELIVERY</Typography>
            <FormGroup>
              <FormControlLabel
                onChange={freeDeliveryChecked}
                name="freeDelivery"
                control={<Checkbox></Checkbox>}
                label="Free delivery"
              ></FormControlLabel>
            </FormGroup>
            <hr />
            <Typography>ASSURED</Typography>
            <FormGroup>
              <FormControlLabel
                onChange={assuredChecked}
                name="freeDelivery"
                control={<Checkbox sx={{ paddingTop: "1px" }}></Checkbox>}
                label={
                  <img
                    alt="fassured"
                    height="21px"
                    width="77px"
                    src="/fassured.png"
                  ></img>
                }
              ></FormControlLabel>
            </FormGroup>
            <hr />
            <Typography>PRICE</Typography>
            <Slider
              getAriaLabel={() => "Price range"}
              value={price}
              onChange={handleChangePrice}
              valueLabelDisplay="auto"
              min={minMax[0]}
              max={minMax[1]}
              // getAriaValueText={valuetext}
              disableSwap
            />
            <Typography>
              Min:{price[0]} to Max:{price[1]}
            </Typography>
            <Stack direction="row">
              <Button onClick={filterDataByPrice}>Filter</Button>
              <Button onClick={resetOriginalData} color="error">
                Reset
              </Button>
            </Stack>
            <hr />
            {/* <Typography>CUSTOMER RATINGS</Typography>
                    <List>
                        {[1,2,3,4].map((star)=>{
                            return(
                                <ListItem
                                    key={star}
                                    disablePadding
                                >
                                <ListItemButton onClick={()=>handleRatingClick(star)} dense>
                                    <Checkbox
                                        edge="start"
                                    />
                                    <ListItemText>{`${star} & above`}</ListItemText>
                                </ListItemButton>
                                </ListItem>
                            )
                        })}
                    </List> */}
          </Stack>
          <Stack
            margin={1}
            spacing={1}
            backgroundColor="#fff"
            padding={1}
            width="100%"
          >
            <Typography fontWeight="bold">Products</Typography>
            <Stack direction="row" alignItems="center">
              <Typography fontSize="14px" fontWeight="bold">
                Sort by
              </Typography>
              {/* <Button size="14px">Popularity</Button> */}
              <Button
                onClick={() => {
                  sortData(ASC);
                }}
                size="14px"
              >
                Price-Low to high
              </Button>
              <Button
                onClick={() => {
                  sortData(DESC);
                }}
                size="14px"
              >
                Price-High to low
              </Button>
              {/* <Button size="14px">Newest</Button> */}
            </Stack>
            <hr />
            <Grid sx={{ cursor: "pointer" }}>
              {products.map((product, index) => {
                return (
                  <>
                    <Stack
                      onClick={() => {
                        history.push(`/view/${product._id}`);
                      }}
                      padding={3}
                      direction="row"
                      spacing={3}
                      alignItems="top-center"
                      key={index}
                    >
                      <Grid item md={3} xs={12}>
                        <Stack justifyContent="center" id="img">
                          <img
                            alt="prod-img"
                            width="200px"
                            src={
                              product.img ? product.img : "/prod-default.jpg"
                            }
                          ></img>
                        </Stack>
                      </Grid>
                      <Grid item md={6} xs={12}>
                        <Stack spacing={1} id="title-desc">
                          <Typography variant="h5">{product.name}</Typography>
                          <Stack direction="row">
                            <Rating
                              value={4}
                              size="small"
                              precision={0.1}
                              readOnly
                            ></Rating>
                            <Typography fontSize="14px">10 ratings</Typography>
                          </Stack>
                          <Stack paddingLeft={3}>
                            <ul>
                              {product.bulletPoints.map((point, index) => {
                                return (
                                  <li key={index}>
                                    <Typography fontSize="14px">
                                      {point}
                                    </Typography>
                                  </li>
                                );
                              })}
                            </ul>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item md={3} xs={12}>
                        <Stack id="price">
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Typography
                              width="auto"
                              fontSize="28px"
                              fontWeight="bold"
                            >
                              ₹{product.salePrice}
                            </Typography>
                            {product.assured === "yes" ? (
                              <img
                                alt="fassured"
                                height="21px"
                                width="77px"
                                src="/fassured.png"
                              />
                            ) : (
                              <></>
                            )}
                          </Stack>
                          <Stack direction="row" spacing={1}>
                            <Typography
                              sx={{
                                textDecoration: "line-through",
                                fontSize: "16px",
                                color: "gray",
                              }}
                            >
                              ₹{product.price}
                            </Typography>
                            <Typography sx={{ color: "green" }}>
                              {calculateDiscountPercentage(
                                product.price,
                                product.salePrice
                              )}
                              % off
                            </Typography>
                          </Stack>
                          <Typography>
                            {product.deliveryCharge > 0
                              ? `Delivery charge ₹${product.deliveryCharge}`
                              : "Free delivery"}
                          </Typography>
                        </Stack>
                      </Grid>
                    </Stack>
                    <hr />
                  </>
                );
              })}
            </Grid>
          </Stack>
        </Stack>
      </Grid>
    </>
  );
}
