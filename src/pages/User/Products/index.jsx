import React, { useState, useEffect, useCallback } from 'react';
import './styles.scss';
import Sidebar from './Sidebar';
import { Col, Pagination, Row, Select } from 'antd';
import { CgLayoutGrid, CgLayoutGridSmall, CgLayoutList } from 'react-icons/cg';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getProducts, getTotalProducts } from '../../../redux/actions';
import ProductItem from '../../../components/ProductItem';
import useWindowDimensions from '../../../until/width';
import Breadcrumb from '../../../components/Breadcrumb';
import { ToastContainer, toast } from 'react-toastify';

const arrSelect = [
  { title: 'Featured', value: 'featured' },
  { title: 'Best Selling', value: 'bestSelling' },
  { title: 'Price, low to high', value: 'priceLowToHigh' },
  { title: 'Price, high to low', value: 'priceHighToLow' },
  { title: 'Date, new to old', value: 'date' }
];

const Products = ({ getProducts, productsData, getTotalProducts, totalProduct }) => {
  const { width } = useWindowDimensions();
  const { Option } = Select;
  const { t } = useTranslation();
  const [numberOfProduct, setNumberOfProduct] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);
  const [bannerData, setBannerData] = useState({});
  const [filterProducts, setFilterProducts] = useState({
    category: [],
    price: [],
    tag: null,
    sort: null
  });

  if (width >= 1200) {
    window.scrollTo({
      top: 430,
      left: 0,
      behavior: 'smooth'
    });
  } else if (width >= 992) {
    window.scrollTo({
      top: 380,
      left: 0,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo({
      top: 340,
      left: 0,
      behavior: 'smooth'
    });
  }

  useEffect(() => {
    getProducts({
      page: currentPage,
      limit: 12,
      category: filterProducts.category,
      price: filterProducts.price,
      tag: filterProducts.tag,
      sort: filterProducts.sort
    });
  }, [filterProducts, currentPage]);

  useEffect(() => {
    document.title = 'Vegist | Trang Sản phẩm';
    getTotalProducts({
      category: filterProducts.category,
      price: filterProducts.price,
      tag: filterProducts.tag,
      sort: filterProducts.sort
    });
  }, [filterProducts, currentPage]);

  const handelChangePage = page => {
    setCurrentPage(page);
  };

  const handelChangeSort = value => {
    setFilterProducts({
      filterProducts,
      sort: value
    });
    setCurrentPage(1);
  };

  const renderLocationProduct = () => {
    const start = (currentPage - 1) * 12 + 1;
    let end;
    if (productsData.length >= 12) {
      end = (currentPage - 1) * 12 + 12;
    } else end = start + productsData.length - 1;
    return `${start} - ${end}`;
  };

  return (
    <div className="products fadeIn">
      <Breadcrumb title="Collection" />
      <div className="container products__container">
        <Row>
          <Col xl={6} lg={7} md={8} sm={24} className="col-sm-100">
            <div className="container">
              <Sidebar
                filterProducts={filterProducts}
                setFilterProducts={setFilterProducts}
                setCurrentPage={setCurrentPage}
                totalProduct={totalProduct}
                setBannerData={setBannerData}
              />
            </div>
          </Col>
          <Col xl={18} lg={17} md={16} sm={24}>
            <div className="container">
              <section className="banner">
                <div
                  className="banner__container"
                  style={{
                    backgroundImage:
                      "url('https://cdn.shopify.com/s/files/1/0412/8151/9765/files/slider18.jpg?v=1607590481')"
                  }}
                >
                  <div className="banner__content">
                    <div className="banner__title">
                      {bannerData.name
                        ? t(`category.${bannerData.name}`)
                        : t('products.Anything...')}
                    </div>
                    <div className="banner__desc text-clamp text-clamp--3">
                      {bannerData && bannerData.description}
                    </div>
                  </div>
                </div>
              </section>
              <section className="topbar">
                <div className="topbar__left">
                  <CgLayoutList />
                  <CgLayoutGrid onClick={() => setNumberOfProduct(3)} />
                  <CgLayoutGridSmall onClick={() => setNumberOfProduct(4)} />
                </div>
                <div className="topbar__right">
                  <span className="topbar__right--text">{t('products.sort by')}</span>
                  <Select
                    showSearch
                    style={{ width: 160 }}
                    placeholder={t(`products.placeholder`)}
                    optionFilterProp="children"
                    onChange={handelChangeSort}
                  >
                    {arrSelect.map((item, index) => (
                      <Option value={item.value} key={`option-${item.value}`}>
                        {t(`products.${item.title}`)}
                      </Option>
                    ))}
                  </Select>
                </div>
              </section>
              <section className="list">
                <div className="list__content">
                  <Row gutter={[16, 16]}>
                    {productsData.map(item => (
                      <Col xl={24 / numberOfProduct} lg={8} sm={12} xs={12}>
                        <ProductItem data={item} />
                      </Col>
                    ))}
                  </Row>
                </div>
              </section>
              {totalProduct.length > 0 && (
                <section className="pagination">
                  <div className="pagination__result">
                    {t('products.Showing')} {renderLocationProduct()} {t('products.of')}{' '}
                    {totalProduct.length} {t('products.result')}
                  </div>
                  <Pagination
                    current={currentPage}
                    onChange={handelChangePage}
                    total={totalProduct?.length}
                    defaultPageSize={12}
                  />
                </section>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <ToastContainer />;
    </div>
  );
};

const mapStateToProps = state => {
  const { productsData, totalProduct } = state.productReducer;
  return {
    productsData,
    totalProduct
  };
};
const mapDispatchToProps = dispatch => {
  return {
    getProducts: params => dispatch(getProducts(params)),
    getTotalProducts: params => dispatch(getTotalProducts(params))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Products);
