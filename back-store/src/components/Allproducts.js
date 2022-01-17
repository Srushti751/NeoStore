import React, { useState, useEffect } from "react";
import axios from "axios";
import { Col, Row, Container, Card, Button, Nav } from "react-bootstrap";
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StarRating from "./StarComponent/StarRating";
import { PaginationDemo } from "./Pagination/PaginationDemo";
// import { Button , Card} from 'react-bootstrap'



function Allproducts({ posts }) {

    const [products, setProducts] = useState([]);

    const [categoryList, setCategoryList] = useState([]);
    const [colorList, setColorList] = useState([]);
    const [quantity, setQuantity] = useState(1)
    const [search, setSearch] = useState("")
    const [user, setUser] = useState(null)

    //Sort by price
    const [priceOption, setPriceOption] = useState("")

    const userState = useSelector(state => state.loginUserReducer)
    const { currentUser } = userState

    const [loading, setloading] = useState(true);
    const [error, setError] = useState(false);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage, setPostsPerPage] = useState(6)
    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    //Getting current page products
    const indexofLastProd = currentPage * postsPerPage
    const indexofFirstProd = indexofLastProd - postsPerPage
    const currentProd = products.slice(indexofFirstProd, indexofLastProd)


    const getProducts = () => {

        axios.get(`/api/product/getProduct`).then(res => setProducts(res.data))
        setloading(false);
    }


    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        axios.get("/api/product/getCategory").then((res) => {
            setCategoryList(res.data);
        });
    }, []);

    useEffect(() => {
        axios.get("/api/product/getColor").then((res) => {
            setColorList(res.data);
        });
    }, []);

    const getCategoryID = (id) => {
        axios.get(`/api/product/getProduct/${id}`).then(res => setProducts(res.data))
    }
    // const getCategoryName = (name) => {
    //     axios.get(`/api/product/getProductCategory/${name}`).then(res => setProducts(res.data))
    // }
    const getColorID = (id) => {
        axios.get(`/api/product/getProductColorID/${id}`).then(res => setProducts(res.data))
    }
    // const getColorName = (name) => {
    //     axios.get(`/api/product//getProductColor/${name}`).then(res => setProducts(res.data))
    // }


    const notify = () => toast("Login to Add to cart");

    const getProductRating = () => {
        axios.get("api/product/getProduct/rating").then((res) => setProducts(res.data))
    }

    const submit = (e, name, image, price, quantity) => {
        e.preventDefault();


        const payload = {
            product_name: name,
            product_image: image,
            product_cost: price,
            quantity: quantity,
            user: currentUser.name
        }
        // const payload =
        // {
        //     cart: cart,
        //     user: currentUser.name
        // }

        axios({
            url: '/api/product/saveOrder',
            method: 'POST',
            data: payload
        })
            .then(() => {
                console.log("data is saved");
                // let cartItem=localStorage.getItem("cartProd")?JSON.parse(localStorage.getItem("cartProd")):[]
                // cartItem.push(payload)
                // localStorage.setItem("cartProd",JSON.stringify(cartItem))
                window.location.reload();
            })
            .catch((err) => {
                // console.log("Internal error")
                toast.info("Already exists in cart")

            })
    }

    const addCartNouser = (e, name, image, price, quantity) => {
        e.preventDefault();


        const payload = {
            product_name: name,
            product_image: image,
            product_cost: price,
            quantity: quantity,
            user: "guest"
        }

        let cartItem = localStorage.getItem("cartProd") ? JSON.parse(localStorage.getItem("cartProd")) : []
        cartItem.push(payload)
        localStorage.setItem("cartProd", JSON.stringify(cartItem))

        axios({
            url: '/api/product/saveOrder',
            method: 'POST',
            data: payload
        })
            .then(() => {
                console.log("data is saved");
                // let cartItem=localStorage.getItem("cartProd")?JSON.parse(localStorage.getItem("cartProd")):[]
                // cartItem.push(payload)
                // localStorage.setItem("cartProd",JSON.stringify(cartItem))
                window.location.reload();
            })
            .catch((err) => {
                console.log("Internal error")
                toast.info("Already exists in cart")

            })
    }


    const ascPrice = () => {
        products.sort((a, b) => parseFloat(a.product_cost) - parseFloat(b.product_cost))
        console.log(products)
    }

    const descPrice = () => {
        products.sort((a, b) => parseFloat(b.product_cost) - parseFloat(a.product_cost))
        console.log(products)
    }


    return (
        <Container >
            <h3 className="text-center m-4"></h3>
            {/* {console.log(products)} */}

            {loading ? (
                <h1>Loading...</h1>
            ) : error ? (
                <p>{error}</p>
            ) : (
                <Row>
                    <Col md={2}>

                        <ul className="list-group">
                            <button className=" sortButton" type="button" onClick={() => getProducts()} data-bs-toggle="dropdown" aria-expanded="false">
                                All Products
                            </button>
                            <div className="  dropdown">
                                <button className="sortButton dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                    Categories
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    {categoryList.map((cat) => {
                                        return (
                                            // <li><button className="dropdown-item" onClick={() => getCategoryName(cat.category_name)}>{cat.category_name}</button></li>
                                            <li><button className="dropdown-item" onClick={() => getCategoryID(cat._id)}>{cat.category_name}</button></li>

                                        )
                                    })}
                                </ul>
                            </div>

                          
                            <div className=" dropdown">
                                <button className=" sortButton dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                    Color
                                </button>
                                <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">
                                    {colorList.map((col) => {
                                        return (
                                            <li><button className="dropdown-item" onClick={() => getColorID(col._id)}>{col.color}</button></li>
                                            // <li><button className="dropdown-item" onClick={() => getColorName(col.color)}>{col.color}</button></li>

                                        )
                                    })}
                                </ul>
                            </div>


                        </ul>



                    </Col>
                    <Col md={10}>
                        {/* <input className="p-3 mt-3 mb-4 " type="text" placeholder="Search..." onChange={(e) => { setSearch(e.target.value) }} /> */}

                        <div className="dropdown">
                            <button className="sortByButton dropdown-toggle" type="button" id="dropdownMenu2" data-bs-toggle="dropdown" aria-expanded="false">
                                Sort By
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu2">

                                <li><button className="dropdown-item" onClick={getProductRating}>Rating</button></li>
                                <li><button className="dropdown-item" onClick={descPrice}>High to Low</button></li>
                                <li><button className="dropdown-item" onClick={ascPrice}>Low to High</button></li>


                            </ul>
                        </div>


                        <Row>
                            {currentProd.filter((val) => {
                                if (search === "") {
                                    return val
                                }
                                else if (val.category_name.toLowerCase().includes(search.toLowerCase()) || val.color.toLowerCase().includes(search.toLowerCase())) {
                                    return val
                                }
                            }).map((piz) => {
                                return (
                                    <Col xs={8} md={6} lg={4}>
                                        <Card
                                            style={{ width: "18rem", margin: "10px", padding: "10px" }}
                                        >

                                            <Card.Img
                                                variant="top"
                                                src={`http://localhost:8089/` + piz.product_image}
                                                // src={piz.product_image}
                                                height="200"
                                                width="300"
                                            />
                                            <Card.Body className="text-center">
                                                <Card.Title>  <Link to={`/product/${piz._id}`}>{piz.product_name}</Link></Card.Title>
                                                <StarRating
                                                    count={5}
                                                    size={20}
                                                    value={piz.rating}
                                                    activeColor={'#FFA91B'}
                                                    inactiveColor={'#ddd'}
                                                />

                                                Qty:<select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                                    {[...Array(10).keys()].map((v, i) => (
                                                        <option value={i + 1}>{i + 1}</option>
                                                    ))}
                                                </select>
                                                <Card.Text style={{ fontWeight: "600", fontSize: "22px", margin: "5px 0" }}>
                                                    Rs.{piz.product_cost * quantity}
                                                </Card.Text>
                                                {/* <Button onClick={(e)=>submit(e,piz.name,piz.image,piz.price,quantity)} variant="warning">Add to cart</Button> */}

                                                {currentUser ? <Button onClick={(e) => submit(e, piz.product_name, piz.product_image, piz.product_cost, quantity)} variant="warning">Add to cart</Button>
                                                    : <>
                                                        <Button variant="danger" onClick={(e) => addCartNouser(e, piz.product_name, piz.product_image, piz.product_cost, quantity)}>Add to cart</Button>
                                                        {/* <Button variant="danger" onClick={notify}>Add to cart</Button> */}
                                                        <ToastContainer />
                                                    </>
                                                }

                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                        <PaginationDemo className="paginateStyle" postsPerPage={postsPerPage} totalPosts={products.length} paginate={paginate} />

                    </Col>
                </Row>
            )}
            <ToastContainer/>
        </Container>
    );
}

export default Allproducts;
