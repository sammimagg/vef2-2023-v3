import request from 'supertest';

import { router } from "../routes/api.js";
import express from 'express';


describe("index", function () {
    it("should return a 200 status code", function (done) {
        const app = express();
        app.use(router);
        request(app).get("/")
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    })
})
describe("departments", function () {
    it("should return a 200 status code", function (done) {
        const app = express();
        app.use(router);
        request(app).get("/departments")
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    })
})
describe("Viðskiptafræði department", function () {
    it("should return a 200 status code", function (done) {
        const app = express();
        app.use(router);
        request(app).get("/departments/vidskiptafraedi")
        .expect(200)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    })
})
