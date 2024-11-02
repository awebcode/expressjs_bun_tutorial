import express from "express";
import { PrismaClient } from "@prisma/client";
const PORT = 5000;
const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.get("/", async (req, res) => {
    const items = await prisma.item.findMany();
    res.send(items);
});
app.get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const items = await prisma.item.findUnique({
        where: {
            id,
        },
    });
    if (!items) {
        res.status(404).send({ message: `Item ${id} not found` });
        return;
    }
    res.send(items);
});
app.post("/", async (req, res) => {
    const data = req.body;
    if (!data) {
        res.status(400).send("No data provided");
        return;
    }
    const item = await prisma.item.create({
        data: {
            title: data.title,
            description: data.description,
        },
    });
    res.send(item);
});
//
app.patch("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const data = req.body;
    const item = await prisma.item.findUnique({
        where: {
            id,
        },
    });
    if (!item) {
        res.status(404).send({ message: `Item ${id} not found` });
        return;
    }
    const itemUpdated = await prisma.item.update({
        where: {
            id,
        },
        data,
    });
    res.send(itemUpdated);
});
app.delete("/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const item = await prisma.item.findUnique({
            where: {
                id,
            },
        });
        if (!item) {
            res.status(404).send({ message: `Item ${id} not found` });
            return;
        }
        await prisma.item.delete({
            where: {
                id,
            },
        });
        res.status(200).send({ message: `Item ${id} deleted` });
    }
    catch (error) {
        res.json({ message: "Something went wrong" });
    }
});
app.use((req, res, next) => {
    res.status(404).send({ message: "Route not found" });
});
app.use((err, req, res, next) => {
    res.status(500).send({ message: "Something went wrong" });
});
app.listen(PORT, () => {
    console.log("Server started on port 3000");
});
