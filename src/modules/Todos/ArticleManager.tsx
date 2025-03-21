import React, { useState, useContext, useEffect } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { AppContext } from "../../../App";
import { articleCollectionName } from "../../store/database/InitializeDatabase";

const ArticleManager = ({ businesses }: any) => {
    const { db } = useContext(AppContext);

    const [newArticle, setNewArticle] = useState({ name: "", qty: "", selling_price: "", business_id: "" });
    const [open, setOpen] = useState(false);
    const [articles, setArticles] = useState<any>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            if (db[articleCollectionName]) {
                await db[articleCollectionName].find().$.subscribe((articles: any) => {
                    setArticles(articles);
                });
            }
        };
        fetchArticles();
    }, [db]);

    const handleAddArticle = async () => {
        if (!newArticle.name || !newArticle.qty || !newArticle.selling_price || !newArticle.business_id) {
            Alert.alert("Error", "Please fill all fields and select a business.");
            return;
        }

        const article = {
            id: `article_${Date.now()}`,
            name: newArticle.name,
            qty: parseFloat(newArticle.qty),
            selling_price: parseFloat(newArticle.selling_price),
            business_id: newArticle.business_id,
        };

        await db[articleCollectionName].insert(article);
        setNewArticle({ name: "", qty: "", selling_price: "", business_id: "" });
    };

    const removeArticle = async (article: any) => {
        Alert.alert(
            "Delete Article?",
            `Are you sure you want to delete '${article.name}'?`,
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    style: "destructive",
                    onPress: async () => {
                        const doc = db[articleCollectionName].findOne({
                            selector: {
                                id: article.id,
                            },
                        });
                        await doc.remove();
                    },
                },
            ]
        );
    };

    const renderBusinessItem = ({ item }: any) => (
        <View style={styles.businessItem}>
            <Text style={styles.businessName}>{item.name}</Text>
            <FlatList
                data={articles.filter((article: any) => article.business_id === item.id)}
                keyExtractor={(article) => article.id}
                renderItem={({ item }) => (
                    <View style={styles.articleItem}>
                        <Text>{item.name} - Qty: {item.qty}, Price: ${parseFloat(item.selling_price).toFixed(2)}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text>No articles for this business.</Text>}
            />
        </View>
    );

    return (
        <FlatList
            data={businesses}
            keyExtractor={(item) => item.id}
            renderItem={renderBusinessItem}
            ListHeaderComponent={
                <View style={styles.container}>
                    <Text style={styles.heading}>Create New Article</Text>
                    <View style={styles.formGroup}>
                        <Text>Article Name</Text>
                        <TextInput
                            style={styles.input}
                            value={newArticle.name}
                            onChangeText={(text) => setNewArticle({ ...newArticle, name: text })}
                            placeholder="Enter article name"
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text>Quantity</Text>
                        <TextInput
                            style={styles.input}
                            value={newArticle.qty}
                            onChangeText={(text) => setNewArticle({ ...newArticle, qty: text })}
                            placeholder="Enter quantity"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text>Selling Price ($)</Text>
                        <TextInput
                            style={styles.input}
                            value={newArticle.selling_price}
                            onChangeText={(text) => setNewArticle({ ...newArticle, selling_price: text })}
                            placeholder="Enter price"
                            keyboardType="numeric"
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text>Select Business</Text>
                        <DropDownPicker
                            open={open}
                            setOpen={setOpen}
                            value={newArticle.business_id} // Ensure this matches one of the `value` fields in `items`
                            setValue={(value) => setNewArticle({ ...newArticle, business_id: value(value) })}
                            items={businesses.map((business: any) => ({
                                label: business.name,
                                value: business.id, // Ensure `value` is correctly set
                            }))}
                            placeholder="-- Choose a Business --"
                            containerStyle={{ marginTop: 10, zIndex: 1000 }}
                            style={styles.dropdown}
                        />
                    </View>
                    <Button title="Add Article" onPress={handleAddArticle} />
                </View>
            }
            ListFooterComponent={<View style={{ height: 20 }} />}
        />
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    heading: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
    formGroup: { marginBottom: 15 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 8, borderRadius: 5, marginTop: 5 },
    businessItem: { marginTop: 15, padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 5 },
    businessName: { fontSize: 18, fontWeight: "bold" },
    articleItem: { marginTop: 10, padding: 5, borderWidth: 1, borderColor: "#eee", borderRadius: 5 },
    dropdown: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        zIndex: 1000
    },
});

export default ArticleManager;