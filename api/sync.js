const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://bhishekrajput8382:<db_password>@cluster0.nzpwl.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

module.exports = async (req, res) => {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { businesses, articles } = req.body;

    try {
        await client.connect();
        const db = client.db("crudapp");

        if (businesses && businesses.length > 0) {
            const businessesCollection = db.collection("businesses");
            await businessesCollection.insertMany(businesses, { ordered: false });
        }

        if (articles && articles.length > 0) {
            const articlesCollection = db.collection("articles");
            await articlesCollection.insertMany(articles, { ordered: false });
        }

        res.status(200).json({ message: "Data synced successfully" });
    } catch (error) {
        console.error("Error syncing with MongoDB:", error);
        res.status(500).json({ error: "Failed to sync data" });
    } finally {
        await client.close();
    }
};