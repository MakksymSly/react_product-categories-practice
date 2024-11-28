/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    item => item.id === product.categoryId,
  );
  const user = usersFromServer.find(item => item.id === category.ownerId);

  return { ...product, category, user };
});

console.log(products);

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [query, setQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const onCategoryClick = categoryId => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const resetAll = () => {
    setSelectedUser(null);
    setQuery('');
    setSelectedCategories([]);
  };

  const prepearedProducts = products
    .filter(product => {
      return selectedUser ? product.user.id === selectedUser : true;
    })
    .filter(product => product.name.toLowerCase().includes(query.toLowerCase()))
    .filter(product =>
      selectedCategories.length > 0
        ? selectedCategories.includes(product.categoryId)
        : true,);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(null)}
              >
                All
              </a>

              {usersFromServer.map(user => {
                return (
                  <a
                    key={user.id}
                    data-cy="Category"
                    className={selectedUser === user.id ? 'is-active' : ''}
                    href="#/"
                    onClick={() => setSelectedUser(user.id)}
                  >
                    {user.name}
                  </a>
                );
              })}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={event => {
                    setQuery(event.target.value);
                  }}
                />
                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query.length > 0 && (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${selectedCategories.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() => onCategoryClick(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetAll()}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User
                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {prepearedProducts.length === 0
                ? 'No products'
                : prepearedProducts.map(product => {
                  return (
                      <tr data-cy="Product" key={product.id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {product.id}
                        </td>

                        <td data-cy="ProductName">{product.name}</td>
                        <td data-cy="ProductCategory">{`${product.category.icon}-${product.category.title}`}</td>

                        <td
                          data-cy="ProductUser"
                          className={
                            product.user.sex === 'm'
                              ? 'has-text-link'
                              : 'has-text-danger'
                          }
                        >
                          {product.user.name}
                        </td>
                      </tr>
                    );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
