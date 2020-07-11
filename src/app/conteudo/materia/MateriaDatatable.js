import BootstrapTable from 'react-bootstrap-table-next';
import React, { Component } from "react";
import filterFactory, { selectFilter } from 'react-bootstrap-table2-filter';


const selectOptions = {
  0: 'good',
  1: 'Bad',
  2: 'unknown'
};
const products = [ {id:1,name:'Lucas',price:2} ];
const columns = [{
  dataField: 'id',
  text: 'Product ID'
}, {
  dataField: 'name',
  text: 'Product Name',
  formatter: cell => selectOptions[cell],
  filter: selectFilter({
    options: selectOptions
  })
}, {
  dataField: 'price',
  text: 'Product Price' 
}];

export default () =>
  <BootstrapTable  keyField='id' data={ products } columns={ columns } filter={ filterFactory() } />
