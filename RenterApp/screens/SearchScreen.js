import { StyleSheet, View, } from "react-native";
import SearchMap from "../components/SearchMap";


const SearchScreen = ({ navigation }) => {
	return (
		<View style={styles.container}>
			<SearchMap navigation={navigation} />
		</View>
	);
};
export default SearchScreen;


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 5,
	},
});
