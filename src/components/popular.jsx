import React from 'react';
import { graphql, useStaticQuery } from "gatsby";
import { Layout } from './layout';
import SingleProduct from './singleProduct';
import { ProductListing } from './product-listing';

// let id;
export default function Popular(props) {
    const data = props.data.allShopifyProduct.edges;
        return (
            <Layout>
                <div className="products">
                    <ProductListing products={data} />
                </div>
            </Layout>
        )
}

