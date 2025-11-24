import React,{useEffect,useState,useRef,useMemo,useCallback,useContext}from"react";
import{View,Text,StyleSheet,TouchableOpacity,ScrollView,Alert,Image,SafeAreaView,TextInput,StatusBar,Platform,}from"react-native";
import AuthImage from"../../components/AuthImage";
import{Ionicons}from"@expo/vector-icons";
import{useRoute,RouteProp,useNavigation}from"@react-navigation/native";
import{NativeStackNavigationProp}from"@react-navigation/native-stack";
import{AppStackParamsList}from"../../routes/app.routes";
import api from"../../services/api";
import HamburgerMenu from"../../components/HamburgerMenu";
import{AuthContext}from"../../contexts/AuthContext";
type OrderRouteProp=RouteProp<AppStackParamsList,"Order">;
interface Product{
id:string;
name:string;
price:string;
description:string;
banner:string|null;
amount:number;
bannerUri:string|null;
}
interface Category{
id:string;
name:string;
products:Product[];
}
interface OrderItem{
id:string;
amount:number;
order_id:string;
product_id:string;
product:Product;
}
const logo=require("../../../assets/logo.png");
export default function Order(){
const route=useRoute<OrderRouteProp>();
const navigation=useNavigation<NativeStackNavigationProp<AppStackParamsList>>();
const{user,isGuest}=useContext(AuthContext);
// ➡️ CORREÇÃO: Desestruturação segura para evitar TypeError
const{order_id,number}=route.params||{};
const[categories,setCategories]=useState<Category[]>([]);
const[openCategory,setOpenCategory]=useState<string|null>(null);
const[total,setTotal]=useState(0);
const[totalItems,setTotalItems]=useState(0);
const[hasOrderItems,setHasOrderItems]=useState(false);
const[searchText,setSearchText]=useState("");
const[orderLoaded,setOrderLoaded]=useState(false);
const[menuVisible,setMenuVisible]=useState(false);
const scrollRef=useRef<ScrollView>(null);
const loadCategories=useCallback(async()=>{
try{
const response=await api.get("/category");
const formatted=(response.data as any[]).map((cat:any):Category=>({
...cat,
name:cat.name||cat.title,
products:cat.products.map((p:any):Product=>{
let fixedBannerUri=p.bannerUri;
if(!fixedBannerUri&&p.banner){
fixedBannerUri=`${api.defaults.baseURL}/files/${p.banner}`;
}
return{
...p,
bannerUri:fixedBannerUri,
amount:0,
};
}),
}));
setCategories(formatted);
if(formatted.length>0){
setOpenCategory(formatted[0].id);
}
}catch(err){
console.log("Erro ao buscar categorias:",err);
Alert.alert('Erro','Não foi possível carregar as categorias.');
}
},[]);
const updateOrderSummaryAndTotal=(updatedCategories:Category[])=>{
let newTotal=0;
let itemsCount=0;
updatedCategories.forEach((cat)=>
cat.products.forEach((p)=>{
if(p.amount>0){
newTotal+=p.amount*parseFloat(p.price);
itemsCount+=p.amount;
}
})
);
setTotal(newTotal);
setTotalItems(itemsCount);
setHasOrderItems(itemsCount>0);
};
const loadOrderItems=useCallback(async()=>{
if(categories.length===0)return;
// 🛑 Checagem usando a variável order_id segura
if(!order_id){
console.log("Order ID faltando. Pulando carregamento de itens do pedido.");
return;
}
try{
const response=await api.get(`/order/detail?order_id=${order_id}`);
const items=(response.data?.items||[])as OrderItem[];
const isPaid=response.data?.pagamento?.some((p:any)=>p.status===1);
if(isPaid){
const clearedCategories=categories.map((cat)=>({
...cat,
products:cat.products.map((prod)=>({...prod,amount:0})),
}));
setCategories(clearedCategories);
updateOrderSummaryAndTotal(clearedCategories);
return;
}
const updatedCategories=categories.map((cat)=>({
...cat,
products:cat.products.map((prod)=>{
const item=items.find((i)=>i.product_id===prod.id);
return{...prod,amount:item?item.amount:0};
}),
}));
setCategories(updatedCategories);
updateOrderSummaryAndTotal(updatedCategories);
}catch(err){
console.log('Erro ao carregar itens do pedido:',err);
}
},[order_id,categories]);
useEffect(()=>{
loadCategories();
},[loadCategories]);
useEffect(()=>{
if(categories.length>0&&!orderLoaded){
loadOrderItems();
setOrderLoaded(true);
}
},[categories,loadOrderItems,orderLoaded]);
const handleAmountChange=(catId:string,prodId:string,newAmount:number)=>{
const updated=categories.map((cat)=>{
if(cat.id===catId){
return{...cat,products:cat.products.map((p)=>p.id===prodId?{...p,amount:newAmount}:p)};
}
return cat;
});
setCategories(updated);
updateOrderSummaryAndTotal(updated);
};
const increment=async(catId:string,prodId:string,currentAmount:number)=>{
try{
if(!order_id){
Alert.alert('Erro','Pedido não está ativo.');
return;
}
await api.post('/order/add',{
order_id:order_id,
product_id:prodId,
amount:1,
});
handleAmountChange(catId,prodId,currentAmount+1);
}catch(err){
console.log('Erro ao adicionar item:',err);
Alert.alert('Erro','Não foi possível adicionar o item ao pedido.');
}
};
const handleCancelOrder=async()=>{
try{
if(!order_id)return;
const response=await api.get(`/order/detail?order_id=${order_id}`);
const items=(response.data?.items||[])as OrderItem[];
await Promise.all(
items.map(item=>api.delete('/order/remove',{params:{item_id:item.id}}))
);
const clearedCategories=categories.map(cat=>({
...cat,
products:cat.products.map(prod=>({...prod,amount:0})),
}));
setCategories(clearedCategories);
updateOrderSummaryAndTotal(clearedCategories);
}catch(err){
console.log('Erro ao cancelar pedido:',err);
Alert.alert('Erro','Não foi possível cancelar o pedido corretamente.');
}
};
const handleNavigateToPayment=()=>{
if(total===0){
Alert.alert('Pedido Vazio','Não é possível finalizar um pedido sem itens.');
return;
}
if(!order_id||!number){
Alert.alert('Erro','Dados de mesa ou pedido faltando.');
return;
}
navigation.navigate('Payment',{
number:number,
order:{id:order_id},
total:total,
});
};
const handleCategoryPress=(id:string)=>{
if(searchText)return;
setOpenCategory(openCategory===id?null:id);
};
const filteredCategories=useMemo(()=>{
if(!searchText)return categories;
const lowerCaseSearch=searchText.toLowerCase();
return categories
.map(category=>{
const filteredProducts=category.products.filter(product=>
product.name.toLowerCase().includes(lowerCaseSearch)||
product.description.toLowerCase().includes(lowerCaseSearch)
);
if(filteredProducts.length>0||category.name.toLowerCase().includes(lowerCaseSearch)){
return{...category,products:filteredProducts.length>0?filteredProducts:category.products};
}
return null;
})
.filter((cat):cat is Category=>cat!==null);
},[categories,searchText]);
return(
<SafeAreaView style={styles.containerLayout}>
<StatusBar backgroundColor="#911F09" barStyle="light-content"/>
<View style={styles.header}>
<TouchableOpacity onPress={()=>setMenuVisible(true)}style={styles.menuButton}>
<View style={styles.column2Layout}>
<View style={styles.boxLayout}/><View style={styles.boxLayout}/><View style={styles.box2Layout}/>
</View>
</TouchableOpacity>
<View style={styles.logoContainer}>
<Image source={logo}style={styles.logoImage}/>
</View>
<View style={styles.headerRightUpdated}>
<TouchableOpacity onPress={()=>navigation.navigate('Cart',{number:number,order_id:order_id})}style={styles.cartButton}>
<Ionicons name="cart-outline"size={28}color="#333"/>
{totalItems>0&&(
<View style={styles.badge}>
<Text style={styles.badgeText}>{totalItems}</Text>
</View>
)}
</TouchableOpacity>
<TouchableOpacity onPress={()=>isGuest?navigation.navigate('SignUp'):navigation.navigate('Account')}>
<Ionicons name="person-circle-outline"size={28}color="#333"/>
</TouchableOpacity>
</View>
</View>
<ScrollView style={styles.scrollView}ref={scrollRef}>
<View style={styles.columnLayout}>
<View style={styles.welcomeContainer}>
<Text style={styles.welcomeText}>Bem-vindo,{isGuest?'Visitante':user?.name||'Visitante'}!</Text>
<Text style={styles.tableText}>Mesa {number??'—'}</Text>
</View>
<View style={styles.searchBarContainer}>
<Ionicons name="search-outline"size={24}color="#5D3A2F"/>
<TextInput style={styles.searchBarInput}placeholder="Pesquisar produtos"placeholderTextColor="#888"value={searchText}onChangeText={setSearchText}/>
</View>
{filteredCategories.map((cat:Category)=>(
<View key={cat.id}style={styles.categoryWrapper}>
<TouchableOpacity onPress={()=>handleCategoryPress(cat.id)}style={styles.row2Layout}disabled={!!searchText}>
<Text style={styles.inputLayout}>{cat.name}</Text>
<Ionicons name={(openCategory===cat.id&&!searchText)?"chevron-up-outline":"chevron-down-outline"}size={36}color="#FFF"/>
</TouchableOpacity>
{(openCategory===cat.id||!!searchText)&&(
<View style={styles.productsListView}>
{cat.products.map((prod:Product)=>{
const productImageUri=prod.bannerUri??prod.banner??'';
const authRequired=prod.name.toLowerCase().includes('calabresa');
return(
<View key={prod.id}style={styles.productContainer}>
{productImageUri?(
authRequired?(
<AuthImage
style={styles.productImageLarge}
uri={productImageUri}
/>
):(
<Image
source={{uri:productImageUri}}
style={styles.productImageLarge}
resizeMode="cover"
onError={(e)=>
console.log(`IMAGE LOAD ERROR: ${prod.name} uri: ${productImageUri}`,e.nativeEvent.error)
}
/>
)
):(
<View style={[styles.productImageLarge,{backgroundColor:"#B72F14"}]}/>
)}
<View style={styles.productInfo}>
<Text style={styles.productName}>{prod.name}</Text>
<Text style={styles.productDesc}>{prod.description}</Text>
<Text style={styles.productPrice}>R${parseFloat(prod.price).toFixed(2)}</Text>
</View>
<TouchableOpacity style={styles.addToCartButton}onPress={()=>increment(cat.id,prod.id,prod.amount)}>
<Text style={styles.addToCartText}>Adicionar ao Carrinho</Text>
</TouchableOpacity>
</View>
);
})}
</View>
)}
</View>
))}
{searchText&&filteredCategories.length===0&&(
<Text style={styles.noResultsText}>Nenhum produto encontrado...</Text>
)}
</View>
</ScrollView>
<View style={styles.footer}>
<TouchableOpacity style={[styles.footerButton,{backgroundColor:"#B72F14"}]}onPress={handleCancelOrder}>
<Text style={styles.footerText}>Cancelar Pedido</Text>
</TouchableOpacity>
<TouchableOpacity style={[styles.footerButton,{backgroundColor:"#F2CA85",opacity:hasOrderItems?1:0.5}]}onPress={handleNavigateToPayment}disabled={!hasOrderItems}>
<Text style={styles.footerText}>Finalizar Pagamento</Text>
</TouchableOpacity>
</View>
<HamburgerMenu
onNavigate={(route:string)=>{
if(route==='Home'){
navigation.canGoBack()?navigation.goBack():navigation.navigate('Dashboard');
}else if(route==='Order'){
Alert.alert("Atenção","Você já está na tela de pedidos. Para iniciar um novo, volte ao início.");
}else{
navigation.navigate(route as any);
}
}}
visible={menuVisible}
onClose={()=>setMenuVisible(false)}
isGuest={isGuest}
/>
</SafeAreaView>
);
}
const styles=StyleSheet.create({
containerLayout:{
flex:1,
backgroundColor:"#911F09",
paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0,
},
header:{
flexDirection:'row',
alignItems:'center',
justifyContent:'space-between',
backgroundColor:'#D9D9D9',
paddingVertical:10,
paddingHorizontal:15,
borderBottomWidth:1,
borderBottomColor:'#ccc',
shadowColor:"rgba(0,0,0,0.25)",
shadowOpacity:0.3,
shadowOffset:{width:0,height:4},
},
scrollView:{
flex:1,
backgroundColor:"#911F09",
},
boxLayout:{
width:28,
height:4,
backgroundColor:"#5D3A2F",
borderRadius:10,
marginBottom:5,
},
box2Layout:{
width:28,
height:4,
backgroundColor:"#5D3A2F",
borderRadius:10,
},
columnLayout:{
backgroundColor:"#D9D9D9",
borderRadius:1,
paddingBottom:160,
marginTop:10,
marginBottom:80,
marginHorizontal:10,
borderBottomLeftRadius:30,
borderBottomRightRadius:30,
},
column2Layout:{
alignItems:"center",
},
inputLayout:{
color:"#FFFFFF",
fontSize:20,
flex:1,
textAlignVertical:'center',
fontWeight:'bold',
},
row2Layout:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center",
backgroundColor:"#911F09",
borderRadius:20,
paddingVertical:12,
paddingHorizontal:24,
marginVertical:8,
marginHorizontal:24,
shadowColor:"#5D3A2FB8",
shadowOpacity:0.7,
shadowOffset:{width:7,height:5},
shadowRadius:4,
elevation:4,
},
headerRightUpdated:{
flexDirection:"row",
alignItems:"center",
marginRight:10,
},
searchBarContainer:{
flexDirection:'row',
alignItems:'center',
backgroundColor:'#FFFFFF',
borderRadius:50,
paddingHorizontal:15,
paddingVertical:10,
marginHorizontal:29,
marginBottom:20,
marginTop:30,
shadowColor:"#000",
shadowOffset:{width:0,height:2},
shadowOpacity:0.15,
shadowRadius:3.84,
elevation:5,
},
searchBarInput:{
flex:1,
marginLeft:10,
fontSize:18,
color:'#101026',
paddingVertical:0,
height:30,
},
noResultsText:{
textAlign:'center',
marginTop:20,
fontSize:18,
color:'#911F09',
fontWeight:'bold',
marginHorizontal:30,
},
productsListView:{
marginHorizontal:12,
marginBottom:15,
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
},
categoryWrapper:{
marginBottom:12,
},
productContainer:{
width:"48%",
flexDirection:"column",
backgroundColor:"#FFFFFF",
marginVertical:6,
padding:8,
borderRadius:8,
alignItems:"center",
borderWidth:1,
borderColor:'#B72F14',
elevation:2,
shadowColor:"#000",
shadowOffset:{width:0,height:1},
shadowOpacity:0.1,
shadowRadius:2,
},
productImageLarge:{
width:100,
height:100,
borderRadius:6,
marginBottom:8,
},
productInfo:{
flex:1,
justifyContent:"center",
alignItems:'center',
width:'100%',
},
productName:{
color:"#101026",
fontWeight:"bold",
fontSize:16,
marginBottom:4,
textAlign:"center",
},
productDesc:{
color:"#555",
fontSize:12,
lineHeight:14,
textAlign:"center",
minHeight:28,
marginBottom:4,
},
productPrice:{
color:"#101026",
fontWeight:"bold",
marginTop:4,
fontSize:14,
textAlign:"center",
},
footer:{
position:'absolute',
bottom:0,
left:0,
right:0,
flexDirection:"row",
justifyContent:"space-between",
padding:12,
backgroundColor:"#911F09",
},
footerButton:{
flex:1,
marginHorizontal:4,
paddingVertical:12,
borderRadius:6,
alignItems:"center",
},
footerText:{
fontWeight:"bold",
color:"#FFF",
fontSize:16,
},
badge:{
position:'absolute',
top:-5,
right:-5,
backgroundColor:'red',
borderRadius:10,
minWidth:20,
height:20,
justifyContent:'center',
alignItems:'center',
},
badgeText:{
color:'white',
fontSize:12,
fontWeight:'bold',
},
menuButton:{
padding:8,
},
logoContainer:{
position:'absolute',
left:0,
right:0,
top:0,
bottom:0,
alignItems:'center',
justifyContent:'center',
},
logoImage:{
width:120,
height:40,
resizeMode:'contain',
},
welcomeContainer:{
alignItems:'center',
marginHorizontal:29,
marginTop:20,
marginBottom:10,
},
welcomeText:{
fontSize:24,
fontWeight:'bold',
color:'#911F09',
textAlign:'center',
},
tableText:{
fontSize:18,
color:'#5D3A2F',
textAlign:'center',
marginTop:5,
},
addToCartButton:{
backgroundColor:"#F2CA85",
paddingVertical:8,
paddingHorizontal:16,
borderRadius:20,
justifyContent:"center",
alignItems:"center",
marginTop:10,
},
addToCartText:{
fontWeight:"bold",
color:"#101026",
fontSize:14,
},
cartButton:{
position:'relative',
marginRight:15,
},
});