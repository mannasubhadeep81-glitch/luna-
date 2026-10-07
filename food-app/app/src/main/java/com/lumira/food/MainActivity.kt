package com.lumira.food

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

data class Restaurant(val name:String,val cuisine:String,val rating:String,val eta:String,val image:String)
data class Food(val name:String,val price:String,val image:String)

private val restaurants = listOf(
 Restaurant("Saffron House","Indian • Biryani • Kebabs","4.8","25–35 min","https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=1200"),
 Restaurant("Burger Atelier","Burgers • Fries • Shakes","4.7","20–30 min","https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200"),
 Restaurant("Pasta Roma","Italian • Pasta • Pizza","4.6","30–40 min","https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200")
)
private val foods = listOf(
 Food("Butter Chicken","₹299","https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900"),
 Food("Chicken Biryani","₹249","https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900"),
 Food("Paneer Tikka","₹219","https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900"),
 Food("Garlic Naan","₹79","https://images.unsplash.com/photo-1617692855027-33b14f061079?w=900")
)

class MainActivity:ComponentActivity(){
 override fun onCreate(state:Bundle?){super.onCreate(state);setContent{FoodApp()}}
}

@Composable
fun FoodApp(){
 var restaurant by remember{mutableStateOf<Restaurant?>(null)}
 var cart by remember{mutableIntStateOf(0)}
 var screen by remember{mutableStateOf("home")}
 MaterialTheme(colorScheme=lightColorScheme(primary=Color(0xFFE64A19),secondary=Color(0xFFFF9800),surface=Color(0xFFFFFBF8))){
  AnimatedContent(targetState=screen,transitionSpec={fadeIn()+slideInHorizontally() togetherWith fadeOut()+slideOutHorizontally()},label="navigation"){
   when(it){
    "home"->Home(cart,{restaurant=it;screen="restaurant"},{screen="cart"})
    "restaurant"->RestaurantPage(restaurant!!,cart,{screen="home"},{cart++},{screen="cart"})
    "cart"->CartPage(cart,{screen="home"},{screen="tracking"})
    else->TrackingPage{screen="home"}
   }
  }
 }
}

@Composable
fun Home(cart:Int,open:(Restaurant)->Unit,cartClick:()->Unit){
 Scaffold(bottomBar={NavigationBar{
  NavigationBarItem(true,{}, {Text("Home",fontSize=10.sp)},icon={Icon(Icons.Default.Home,null)})
  NavigationBarItem(false,cartClick,{Text("Cart",fontSize=10.sp)},icon={Icon(Icons.Default.ShoppingBag,null)})
  NavigationBarItem(false,{}, {Text("Profile",fontSize=10.sp)},icon={Icon(Icons.Default.Person,null)})
 }}){p->
  LazyColumn(Modifier.fillMaxSize().padding(p).background(Color(0xFFFFFBF8)),contentPadding=PaddingValues(bottom=30.dp)){
   item{
    Row(Modifier.fillMaxWidth().padding(20.dp),verticalAlignment=Alignment.CenterVertically){
     Column(Modifier.weight(1f)){Row(verticalAlignment=Alignment.CenterVertically){Icon(Icons.Default.LocationOn,null,tint=Color(0xFFE64A19),modifier=Modifier.size(18.dp));Text(" Deliver to",fontSize=12.sp,color=Color.Gray)};Text("Kolkata • Home",fontSize=18.sp,fontWeight=FontWeight.Bold)}
     BadgedBox(badge={if(cart>0)Badge{Text(cart.toString())}}){IconButton(cartClick){Icon(Icons.Default.ShoppingBag,null)}}
    }
    Row(Modifier.padding(horizontal=20.dp).fillMaxWidth().clip(RoundedCornerShape(18.dp)).background(Color.White).padding(15.dp),verticalAlignment=Alignment.CenterVertically){Icon(Icons.Default.Search,null);Text("Search restaurants or dishes",Modifier.padding(start=10.dp),color=Color.Gray);Spacer(Modifier.weight(1f));Icon(Icons.Default.Tune,null)}
    Spacer(Modifier.height(22.dp));Text("Craving something special?",Modifier.padding(horizontal=20.dp),fontSize=28.sp,fontWeight=FontWeight.ExtraBold);Text("Discover restaurants near you",Modifier.padding(horizontal=20.dp),color=Color.Gray);Spacer(Modifier.height(16.dp))
   }
   item{LazyRow(contentPadding=PaddingValues(horizontal=20.dp),horizontalArrangement=Arrangement.spacedBy(14.dp)){items(restaurants){RestaurantCard(it){open(it)}}}}
   item{Spacer(Modifier.height(24.dp));Text("Popular near you",Modifier.padding(horizontal=20.dp),fontSize=20.sp,fontWeight=FontWeight.Bold)}
   items(foods.take(3)){FoodRow(it)}
  }
 }
}

@Composable
fun RestaurantCard(r:Restaurant,click:()->Unit){
 Card(Modifier.width(285.dp).clickable(click),shape=RoundedCornerShape(24.dp)){Column{
  AsyncImage(r.image,null,Modifier.fillMaxWidth().height(170.dp),contentScale=ContentScale.Crop)
  Column(Modifier.padding(14.dp)){Text(r.name,fontSize=20.sp,fontWeight=FontWeight.Bold);Text(r.cuisine,color=Color.Gray);Text("★ "+r.rating+"   •   "+r.eta,Modifier.padding(top=8.dp),fontWeight=FontWeight.SemiBold)}
 }}
}

@Composable
fun RestaurantPage(r:Restaurant,cart:Int,back:()->Unit,add:()->Unit,openCart:()->Unit){
 var intro by remember(r){mutableStateOf(true)}
 LaunchedEffect(r){kotlinx.coroutines.delay(650);intro=false}
 Box(Modifier.fillMaxSize().background(Color(0xFFFFFBF8))){
  LazyColumn(Modifier.fillMaxSize(),contentPadding=PaddingValues(bottom=100.dp)){
   item{AsyncImage(r.image,null,Modifier.fillMaxWidth().height(280.dp),contentScale=ContentScale.Crop);Column(Modifier.padding(20.dp)){Text(r.name,fontSize=30.sp,fontWeight=FontWeight.ExtraBold);Text(r.cuisine,color=Color.Gray);Text("★ "+r.rating+"   •   "+r.eta,Modifier.padding(top=8.dp));Spacer(Modifier.height(22.dp));Text("Available now",fontSize=22.sp,fontWeight=FontWeight.Bold)}}
   items(foods){FoodRow(it,add)}
  }
  IconButton(back,Modifier.padding(14.dp).background(Color.White.copy(.9f),CircleShape).align(Alignment.TopStart)){Icon(Icons.Default.ArrowBack,null)}
  AnimatedVisibility(intro,enter=fadeIn(),exit=fadeOut(),modifier=Modifier.fillMaxSize()){Box(Modifier.background(Color.Black.copy(.25f)),contentAlignment=Alignment.Center){Card(shape=RoundedCornerShape(28.dp)){Column(Modifier.padding(24.dp),horizontalAlignment=Alignment.CenterHorizontally){AsyncImage(r.image,null,Modifier.size(150.dp).clip(CircleShape),contentScale=ContentScale.Crop);Spacer(Modifier.height(12.dp));Text(r.name,fontWeight=FontWeight.Bold,fontSize=20.sp);Text("Opening restaurant…",color=Color.Gray)}}}}
  if(cart>0)Button(openCart,Modifier.align(Alignment.BottomCenter).padding(18.dp).fillMaxWidth(),shape=RoundedCornerShape(18.dp)){Icon(Icons.Default.ShoppingBag,null);Spacer(Modifier.width(8.dp));Text("View Cart • "+cart+" items")}
 }
}

@Composable
fun FoodRow(f:Food,add:(()->Unit)?=null){
 var pressed by remember{mutableStateOf(false)}
 val scale by animateFloatAsState(if(pressed)1.08f else 1f,spring(),label="food_add")
 Row(Modifier.fillMaxWidth().padding(horizontal=20.dp,vertical=8.dp),verticalAlignment=Alignment.CenterVertically){
  AsyncImage(f.image,null,Modifier.size(86.dp).clip(RoundedCornerShape(18.dp)),contentScale=ContentScale.Crop)
  Column(Modifier.weight(1f).padding(horizontal=14.dp)){Text(f.name,fontWeight=FontWeight.Bold,fontSize=16.sp);Text(f.price,color=Color(0xFFE64A19),fontWeight=FontWeight.Bold);Text("Available • Freshly prepared",fontSize=11.sp,color=Color.Gray)}
  if(add!=null)IconButton({pressed=true;add()},Modifier.scale(scale)){Icon(Icons.Default.Add,null,tint=Color(0xFFE64A19))}
 }
}

@Composable
fun CartPage(cart:Int,back:()->Unit,checkout:()->Unit){
 Column(Modifier.fillMaxSize().background(Color(0xFFFFFBF8)).padding(20.dp)){
  Row(verticalAlignment=Alignment.CenterVertically){IconButton(back){Icon(Icons.Default.ArrowBack,null)};Text("Your Cart",fontSize=28.sp,fontWeight=FontWeight.ExtraBold)}
  Spacer(Modifier.height(20.dp));Text(cart.toString()+" items",color=Color.Gray);Spacer(Modifier.height(16.dp))
  Card(shape=RoundedCornerShape(22.dp),colors=CardDefaults.cardColors(Color.White)){Column(Modifier.padding(20.dp)){Text("Saffron House",fontWeight=FontWeight.Bold,fontSize=18.sp);Text("Ready for checkout",color=Color.Gray);Spacer(Modifier.height(14.dp));Row{Text("Subtotal",Modifier.weight(1f));Text("₹"+(cart*249))};Row{Text("Delivery",Modifier.weight(1f));Text("₹39")};HorizontalDivider(Modifier.padding(vertical=10.dp));Row{Text("Total",Modifier.weight(1f),fontWeight=FontWeight.Bold);Text("₹"+(cart*249+39),fontWeight=FontWeight.Bold)}}}
  Spacer(Modifier.weight(1f));Button(checkout,Modifier.fillMaxWidth().height(56.dp),shape=RoundedCornerShape(18.dp)){Text("Place Order",fontSize=17.sp,fontWeight=FontWeight.Bold)}
 }
}

@Composable
fun TrackingPage(back:()->Unit){
 Column(Modifier.fillMaxSize().background(Color(0xFFFFFBF8)).padding(20.dp)){
  Row(verticalAlignment=Alignment.CenterVertically){IconButton(back){Icon(Icons.Default.ArrowBack,null)};Text("Track Order",fontSize=28.sp,fontWeight=FontWeight.ExtraBold)}
  Card(Modifier.fillMaxWidth().height(330.dp),shape=RoundedCornerShape(28.dp)){Box(Modifier.fillMaxSize().background(Brush.linearGradient(listOf(Color(0xFFEAF2FF),Color(0xFFFFF4E9)))),contentAlignment=Alignment.Center){Icon(Icons.Default.Map,null,Modifier.size(110.dp),tint=Color(0xFFE64A19));Text("Live delivery map",Modifier.align(Alignment.BottomCenter).padding(20.dp),fontWeight=FontWeight.Bold)}}
  Spacer(Modifier.height(20.dp));Text("Order confirmed",fontSize=24.sp,fontWeight=FontWeight.Bold);Text("Restaurant is preparing your food",color=Color.Gray);Spacer(Modifier.height(18.dp))
  listOf("Order confirmed","Preparing","Rider picking up","On the way","Delivered").forEachIndexed{i,s->Row(Modifier.padding(vertical=8.dp),verticalAlignment=Alignment.CenterVertically){Box(Modifier.size(16.dp).clip(CircleShape).background(if(i<2)Color(0xFFE64A19)Color.LightGray));Spacer(Modifier.width(12.dp));Text(s,fontWeight=if(i<2)FontWeight.Bold else FontWeight.Normal)}}
 }
}
