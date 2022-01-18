const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const db = async () => {
    try {
        await mongoose
            .connect(
                "mongodb+srv://siva:siva1991@sivacluster.xxes8.mongodb.net/studentDatabase?retryWrites=true&w=majority"
            )
            .then(() => {
                console.log("DB Connected...!!!");
                app.listen(9090, () => console.log("Server Running"));
            })
            .catch((error) => console.log(error.message));
    } catch (error) {
        console.log(error.message);
    }
};

db();

const studentSchema = new mongoose.Schema({
    student_name: String,
    class: Number,
    section: String,
    subjects: Array,
    course_fee: Number,
    date_of_joining: String,
    age: Number,
    weight: Number,
});

const studentMarksSchema = new mongoose.Schema({
    name: String,
    marks: Number,
    age: Number,
});

const studentCollection = mongoose.model("studentsdatas", studentSchema);
const studentMarksCollection = mongoose.model(
    "studentsMarks",
    studentMarksSchema
);

app.post("/students/", async (request, response) => {
    try {
        await studentCollection.insertMany(request.body);
        response.send(await studentCollection.find());
    } catch (error) {
        console.log(error.message);
    }
});

app.post("/studentsmarks/", async (request, response) => {
    try {
        await studentMarksCollection.insertMany(request.body);
        response.send(await studentMarksCollection.find());
    } catch (error) {
        console.log(error.message);
    }
});

//get data
app.get("/getstudentsdata/", async (request, response) => {
    try {
        response.send(await studentCollection.aggregate().count("no:"));
    } catch (error) {
        console.log(error.message);
    }
});

// get all students names
app.get("/studentnames/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                {
                    $project: { student_name: 1, _id: 0 },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

// match

app.get("/students%20data%20age%20greathan/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                {
                    $match: { age: { $gte: 13 } },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

//asyncIterator()
app.get("/students%20names%20age%20greaterthan/", async (request, response) => {
    try {
        const names = studentCollection.aggregate([
            {
                $match: { age: { $gte: 13 } },
            },
        ]);
        for await (let name of names) {
            console.log(name.student_name);
        }
    } catch (error) {
        console.log(error.message);
    }
});

// student_names and age where students age greaterthan
app.get("/studentnamesandagegreaterthan/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                { $match: { age: { $gte: 13 } } },
                {
                    $project: {
                        student_name: 1,
                        age: 1,
                        _id: 0,
                    },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

// student_names and age where students age greaterthan in section A
app.get(
    "/studentnamesandagegreaterthaninsectionA/",
    async (request, response) => {
        try {
            response.send(
                await studentCollection.aggregate([
                    { $match: { age: { $gte: 13 }, section: { $eq: "A" } } },
                    {
                        $project: {
                            student_name: 1,
                            age: 1,
                            _id: 0,
                        },
                    },
                ])
            );
        } catch (error) {
            console.log(error.message);
        }
    }
);

// addField
app.get("/addField/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate.addFields({
                newField: "$b.roll_number",
                plusTen: { $add: ["$val", 10] },
                sub: {
                    student_name: "$a",
                },
            })
        );
    } catch (error) {
        console.log(error.message);
    }
});

// allowDiskuse()
app.get("/diskuse/", async (request, response) => {
    try {
        response.send(
            await studentCollection
                .aggregate([
                    { $match: { age: { $gte: 13 } } },
                    {
                        $project: {
                            student_name: 1,
                            age: 1,
                            _id: 0,
                        },
                    },
                ])
                .allowDiskUse(true)
        );
    } catch (error) {
        console.log(error.message);
    }
});

//append()
app.get("/append/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate.append(
                { $match: { age: { $gte: 13 } } },
                {
                    $project: {
                        student_name: 1,
                        age: 1,
                        _id: 0,
                    },
                }
            )
        );
    } catch (error) {
        console.log(error.message);
    }
});

//collation()
app.get("/collation/", async (request, response) => {
    try {
        response.send(
            await studentCollection
                .aggregate([
                    { $match: { age: { $gte: 13 } } },
                    {
                        $project: {
                            student_name: 1,
                            age: 1,
                            _id: 0,
                        },
                    },
                ])
                .collation({ locale: "en_US", strength: 1 })
        );
    } catch (error) {
        console.log(error.message);
    }
});

//count()
app.get("/count/", async (request, response) => {
    try {
        response.send(
            await studentCollection
                .aggregate([
                    { $match: { age: { $gte: 13 } } },
                    {
                        $project: {
                            student_name: 1,
                            age: 1,
                            _id: 0,
                        },
                    },
                ])
                .count("student_count")
        );
    } catch (error) {
        console.log(error.message);
    }
});

//exec()
app.get("/exec/", async (request, response) => {
    try {
        const callFunction = () => {
            return [
                { $match: { age: { $gte: 13 } } },
                {
                    $project: {
                        student_name: 1,
                        age: 1,
                        _id: 0,
                    },
                },
            ];
        };
        const promise = await studentCollection.aggregate().exec(callFunction);
        response.send(promise.then());
    } catch (error) {
        console.log(error.message);
    }
});

//facet()
app.get("/facet/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate().facet({
                students: [{ groupBy: "$student_name" }],
                age: [{ $bucketAuto: { groupBy: "$age", buckets: 2 } }],
            })
        );
    } catch (error) {
        console.log(error.message);
    }
});

//group()
app.get("/group/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate().group({ _id: "$student_name" })
        );
    } catch (error) {
        console.log(error.message);
    }
});

//limit()
app.get("/limit/", async (request, response) => {
    try {
        response.send(await studentCollection.aggregate().limit(2));
    } catch (error) {
        console.log(error.message);
    }
});

//match()
app.get("/match/", async (request, response) => {
    try {
        response.send(
            await studentCollection
                .aggregate()
                .match({ student_name: { $in: [/siva/] } })
        );
    } catch (error) {
        console.log(error.message);
    }
});

//pipeline()
app.get("/pipeline/", async (request, response) => {
    try {
        response.send(
            await studentCollection
                .aggregate()
                .match({ student_name: { $in: ["siva", "tanvi"] } })
                .pipeline()
        );
    } catch (error) {
        console.log(error.message);
    }
});

//project()
app.get("/project/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate().project("student_name age -_id")
        );
    } catch (error) {
        console.log(error.message);
    }
});

// app.get("/projectavg/", async (request, response) => {
//     try {
//         response.send(
//             await studentCollection
//                 .aggregate()
//                 .project({ avg: { $avg: "age" } })
//         );
//     } catch (error) {
//         console.log(error.message);
//     }
// });

//sample() -- gives ramdom no of documents
app.get("/sample/", async (request, response) => {
    try {
        response.send(await studentCollection.aggregate().sample(2));
    } catch (error) {
        console.log(error.message);
    }
});

//search()
app.get("/search/", async (request, response) => {
    try {
        response.send(
            await studentCollection
                .aggregate()
                .search({ student_name: { query: "siva" } })
        );
    } catch (error) {
        console.log(error.message);
    }
});

//skip()
app.get("/skip/", async (request, response) => {
    try {
        response.send(await studentCollection.aggregate().skip(10));
    } catch (error) {
        console.log(error.message);
    }
});

//sort()
app.get("/sort/", async (request, response) => {
    try {
        response.send(
            await studentCollection
                .aggregate([
                    { $match: { age: { $gte: 13 } } },
                    {
                        $project: {
                            student_name: 1,
                            age: 1,
                            _id: 0,
                        },
                    },
                ])
                .sort("age -student_name")
        );
    } catch (error) {
        console.log(error.message);
    }
});

//sortByCount()
app.get("/sortbycount/", async (request, response) => {
    try {
        response.send(await studentCollection.aggregate().sortByCount("age"));
    } catch (error) {
        console.log(error.message);
    }
});

//unwind()
app.get("/unwind/", async (request, response) => {
    try {
        response.send(await studentCollection.aggregate().unwind("class"));
    } catch (error) {
        console.log(error.message);
    }
});

app.get("/unwindmulti/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate().unwind("student_name", "weight")
        );
    } catch (error) {
        console.log(error.message);
    }
});

//Displaying the total number of students in one class only
app.get("/totalstudents/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                { $match: { class: 10, section: "A" } },
                { $count: "Total students" },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

//Displaying the total number of students in both the sections and maximum and minimum age from both section
app.get("/totalstudentseachclasswithmaxage/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                {
                    $group: {
                        _id: "$class",
                        total_students: { $sum: 1 },
                        max_age: { $max: "$age" },
                        min_age: { $min: "$age" },
                    },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

//Displaying details of a students having the largest age in the class
// app.get("/studentwithmaxage/", async (request, response) => {
//     try {
//         response.send(
//             await studentCollection.aggregate([
//                 { $group: { _id: "$class" } },
//                 { $sort: { age: -1 } },
//                 { $limit: 1 },
//             ])
//         );
//     } catch (error) {
//         console.log(error.message);
//     }
// });

//distinct
app.get("/distinctnames/", async (request, response) => {
    try {
        response.send(await studentCollection.distinct("student_name"));
    } catch (error) {
        console.log(error.message);
    }
});

//lookup
app.get("/lookup/", async (request, response) => {
    try {
        response.send(
            await studentMarksCollection.aggregate([
                {
                    $lookup: {
                        from: "studentsdatas",
                        localField: "name",
                        foreignField: "student_name",
                        as: "student_details",
                    },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

//and operator
app.get("/andoperator/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                {
                    $match: {
                        $and: [
                            { class: 10 },
                            { section: "A" },
                            { weight: { $lte: 35 } },
                        ],
                    },
                },
                {
                    $project: {
                        student_name: 1,
                        class: 1,
                        section: 1,
                        weight: 1,
                        _id: 0,
                    },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

//or operator
app.get("/oroperator/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                {
                    $match: {
                        $or: [
                            { class: 10 },
                            { section: "A" },
                            { weight: { $lte: 35 } },
                        ],
                    },
                },
                {
                    $project: {
                        student_name: 1,
                        class: 1,
                        section: 1,
                        weight: 1,
                        _id: 0,
                    },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

//not operator
app.get("/notoperator/", async (request, response) => {
    try {
        response.send(
            await studentCollection.aggregate([
                {
                    $match: {
                        $or: [
                            { class: 10 },
                            { section: "A" },
                            { weight: { $lte: 35 } },
                        ],
                        $not: [{ section: "B" }],
                    },
                },
                {
                    $project: {
                        student_name: 1,
                        class: 1,
                        section: 1,
                        weight: 1,
                        _id: 0,
                    },
                },
            ])
        );
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = app;
