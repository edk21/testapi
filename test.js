const express = require('express');
const axios = require('axios');
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });

const app = express();
const apiUrl = 'https://lereacteur-bootcamp-api.herokuapp.com/api/flink';
//const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmViOGQ3MTY1MWMwYzAwMTZiYzJjMmIiLCJlbWFpbCI6ImRld2lzbWVjaW5keUBhb2wuY29tIiwiZXhwaXJhdGlvbkRhdGUiOiIyMDIzLTA2LTE3VDIzOjAwOjAwLjAwMFoiLCJpc1RyYWluaW5nIjp0cnVlLCJpYXQiOjE2ODAzNTY3NjV9.OIp7rwfhv4DY02SQWNFK2ezFqViuAo4zphAj-x1s5AA'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDMwNWI5NDljOWM5OWNlNzQwNTNlMzciLCJlbnRpdHlJZCI6IjY0MzA1Yjk0OWM5Yzk5Y2U3NDA1M2UzNyIsImVudGl0eVR5cGUiOiJ1c2VyIiwiaWF0IjoxNjgwODkyMTAyfQ._gxtp2YxPmrdtNuy4lcWy2i21v1iwiZR-8bnokXX-YY'
const PORT = process.env.PORT || 5002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Set up headers with Bearer Token
const headers = {
    Authorization: `Bearer ${token}`,
  };

app.get("/", (req, res) => {
try {
    return res.status(200).json("Bienvenue sur notre serveur Flink");
} catch (error) {
    return res.status(400).json({ error: error.message });
}
});

// Rechercher une adresse postale
app.get('/locations', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`${apiUrl}/locations?q=${query}`,
    { headers }
    );
    const locations = response.data;
    res.json(locations);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// Obtenir la liste des entrepôts (hubs) de départ
app.get('/locations/hubs', async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/locations/hubs`,
    { headers }
    );
    const hubs = response.data;
    res.json(hubs);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// Obtenir la liste des catégories (et sous-catégories associées) de produits
app.get('/categories', async (req, res) => {
  try {
    const response = await axios.get(`${apiUrl}/categories`,
    { headers }
    );
    const categories = response.data;
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// Obtenir la liste des produits d'une catégorie
app.get('/categories/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const response = await axios.get(`${apiUrl}/categories/${slug}`,
    { headers }
    );
    const products = response.data;
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

// Obtenir une liste de produits
  app.post('/products', async (req, res) => {
    const product_skus = [
      "14003907",
      "14003884",
      "14003902",
      "14003894",
      "14003883",
      "14003870"
    ]
  
    try {
      const response = await axios.post(`https://lereacteur-bootcamp-api.herokuapp.com/api/flink/products`, {
        product_skus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Return the data from the API to the client
      res.send(response.data);
    } catch (error) {
      console.error(error);
  
      // Return an error status code and message to the client
      res.status(500).send('Error fetching products from API');
    }
  });
  
  // Rechercher un produit par name
  app.get('/products/search', async (req, res) => {
    const { q, page_limit } = req.query;
    try {
      const response = await axios.get(`${apiUrl}/products/search?q=${q}&page_limit=${page_limit}`,
      { headers }
      );
      const products = response.data;
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  });

  // Rechercher un produit par sku
app.get('/products/:sku', async (req, res) => {
    const sku = req.params.sku;
    try {
      const response = await axios.get(`${apiUrl}/products/${sku}`,
      { headers }
      );
      const product = response.data;
      res.json(product);
    } catch (error) {
      console.error(error);
      res.status(500).send('Erreur serveur');
    }
  });

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

