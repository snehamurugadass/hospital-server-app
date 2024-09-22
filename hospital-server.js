const fs = require('fs');
const path = require('path');

const express = require('express');

const app = express();
const PORT = 3000;
const DATA_FILE = './hospital-data.json';

// Middleware to parse JSON bodies
app.use(express.json());

// GET all hospitals
app.get('/hospitals', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error reading data' });
    } else {
      res.send(JSON.parse(data));
    }
  });
});

// GET hospital by ID
app.get('/hospitals/:id', (req, res) => {
  const id = (req.params.id);
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error reading data' });
    } else {
      const hospitals = JSON.parse(data);
      const hospital = hospitals.find((h) =>h.id=== parseInt(id));
      if (!hospital) {
        res.status(404).send({ message: 'Hospital not found' });
      } else {
        res.send(hospital);
      }
    }
  });
});

// POST new hospital
app.post('/hospitals', (req, res) => {
  const { name, patientCount, location } = req.body;
  if (!name || !patientCount || !location) {
    res.status(400).send({ message: 'Missing required fields' });
  } else {
    const newHospital = {
      
      name,
      patientCount,
      location,
    };
    fs.readFile(DATA_FILE, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send({ message: 'Error reading data' });
      } else {
        const hospitals = JSON.parse(data);
        hospitals.push(newHospital);
        fs.writeFile(DATA_FILE, JSON.stringify(hospitals, null, 2), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send({ message: 'Error writing data' });
          } else {
            res.send(newHospital);
          }
        });
      }
    });
  }
});

// PUT update hospital
app.put('/hospitals/:id', (req, res) => {
  const id = (req.params.id);
  const { name, patientCount, location } = req.body;
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error reading data' });
    } else {
      const hospitals = JSON.parse(data);
      const hospitalIndex = hospitals.findIndex((h) => h.id === parseInt(id));
      if (hospitalIndex === -1) {
        res.status(404).send({ message: 'Hospital not found' });
      } else {
        hospitals[hospitalIndex].name = name;
        hospitals[hospitalIndex].patientCount = patientCount;
        hospitals[hospitalIndex].location = location;
        fs.writeFile(DATA_FILE, JSON.stringify(hospitals, null, 2), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send({ message: 'Error writing data' });
          } else {
            res.send(hospitals[hospitalIndex]);
          }
        });
      }
    }
  });
});

// DELETE hospital
app.delete('/hospitals/:id', (req, res) => {
  const id = (req.params.id);
  fs.readFile(DATA_FILE, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send({ message: 'Error reading data' });
    } else {
      const hospitals = JSON.parse(data);
      const hospitalIndex = hospitals.findIndex((h) => h.id === parseInt(id));
      if (hospitalIndex === -1) {
        res.status(404).send({ message: 'Hospital not found' });
      } else {
        hospitals.splice(hospitalIndex, 1);
        fs.writeFile(DATA_FILE, JSON.stringify(hospitals, null, 2), (err) => {
          if (err) {
            console.error(err);
            res.status(500).send({ message: 'Error writing data' });
          } else {
            res.send({ message: 'Hospital deleted successfully' });
          }
        });
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});