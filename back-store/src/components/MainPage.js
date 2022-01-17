import React from 'react'
import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductPage from './ProductPage';
function MainPage() {


  const [anchorEl, setAnchorEl] = React.useState(null);
  const [prod, setProd] = React.useState([]);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const getCategory=(id)=>{
    axios.get(`/api/product/getProduct/${id}`).then(res=>setProd(res.data))
  }

  return (
    <div>
      {console.log(prod)}
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Categories
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={handleClose}>Mobile</MenuItem>
        <Link onClick={()=>getCategory(3)}>Mobile</Link>
        <MenuItem onClick={handleClose}>Sofa</MenuItem>
        <MenuItem onClick={handleClose}>Table</MenuItem>
      </Menu>
    </div>
  );
}

export default MainPage
