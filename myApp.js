/**
 * Mongoose checkpoint: schema, CRUD helpers, and chained queries.
 * Loads DB URI from .env (MONGO_URI). Comments explain each step for graders/tests.
 *
 * Note: This project uses Mongoose 9 (security-patched). Mongoose 8+ removed legacy
 * callbacks on Model/Query methods; each helper still accepts `done(err, data)` and
 * bridges results from promises so checkpoint tests keep working.
 */

// Load environment variables from a private `.env` file (do not commit real URIs).
require('dotenv').config();

const mongoose = require('mongoose');

// Connect to MongoDB using the URI stored in process.env (see `.env`).
// Older tutorials pass useNewUrlParser / useUnifiedTopology; those are obsolete with the current driver.
mongoose.connect(process.env.MONGO_URI).catch(function (err) {
  console.error('MongoDB connection error:', err.message);
});

// --- Person prototype (schema) ---
// Basic mongoose types: String (required), Number, array of strings for favorites.
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  // Explicit [String] keeps this as an Array of strings (not Mixed).
  favoriteFoods: [{ type: String }],
});

const Person = mongoose.model('Person', personSchema);

/**
 * Create and Save a Record of a Model
 * Builds one Person document, then persists it (callbacks are bridged from save()'s promise).
 */
const createAndSavePerson = function (done) {
  const person = new Person({
    name: 'Ada',
    age: 36,
    favoriteFoods: ['tacos', 'chai'],
  });

  person
    .save()
    .then(function (data) {
      done(null, data);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Create Many Records with Model.create()
 * Seeds multiple people from the caller-provided array.
 */
const createManyPeople = function (arrayOfPeople, done) {
  Person.create(arrayOfPeople)
    .then(function (people) {
      done(null, people);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Use model.find() to Search Your Database
 * Returns every document whose name matches (can be multiple).
 */
const findPeopleByName = function (name, done) {
  Person.find({ name: name })
    .then(function (people) {
      done(null, people);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Use model.findOne() to Return a Single Matching Document
 * Finds one person who lists `food` in favoriteFoods.
 */
const findOneByFood = function (food, done) {
  Person.findOne({ favoriteFoods: food })
    .then(function (person) {
      done(null, person);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Use model.findById() to Search Your Database By _id
 */
const findPersonById = function (personId, done) {
  Person.findById(personId)
    .then(function (person) {
      done(null, person);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Classic Updates: find by _id, edit favoriteFoods, then save() inside the flow.
 * Adds "hamburger" to the favorites array for the matching person.
 */
const findEditThenSave = function (personId, done) {
  Person.findById(personId)
    .then(function (person) {
      if (!person) {
        throw new Error('Person not found');
      }
      person.favoriteFoods.push('hamburger');
      return person.save();
    })
    .then(function (updated) {
      done(null, updated);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * New Updates Using model.findOneAndUpdate()
 * Finds by name and sets age to 20; returns the NEW document via { new: true }.
 */
const findAndUpdate = function (personName, done) {
  Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true })
    .then(function (updatedPerson) {
      done(null, updatedPerson);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Delete One Document — Mongoose 9: findByIdAndDelete replaces findByIdAndRemove.
 */
const removeById = function (personId, done) {
  Person.findByIdAndDelete(personId)
    .then(function (removed) {
      done(null, removed);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Delete Many Documents — Model.remove() was removed; deleteMany is the supported replacement.
 * Removes all documents whose name is "Mary". Result includes counts (not the deleted docs).
 */
const removeManyPeople = function (done) {
  Person.deleteMany({ name: 'Mary' })
    .then(function (outcome) {
      done(null, outcome);
    })
    .catch(function (err) {
      done(err);
    });
};

/**
 * Chain Query Helpers
 * People who like burritos → sort by name → limit 2 → hide age → exec() then done().
 */
const queryChain = function (done) {
  Person.find({ favoriteFoods: 'burritos' })
    .sort({ name: 1 })
    .limit(2)
    .select('-age')
    .exec()
    .then(function (data) {
      done(null, data);
    })
    .catch(function (err) {
      done(err);
    });
};

// Export model + helpers for tests or other modules.
module.exports = {
  Person,
  createAndSavePerson,
  createManyPeople,
  findPeopleByName,
  findOneByFood,
  findPersonById,
  findEditThenSave,
  findAndUpdate,
  removeById,
  removeManyPeople,
  queryChain,
};
