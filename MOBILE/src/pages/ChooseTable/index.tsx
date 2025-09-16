import React, {useState} from "react";
import { SafeAreaView, View, ScrollView, Text, TextInput, TouchableOpacity, Image, } from "react-native";
export default (props: any) => {
	const [textInput1, onChangeTextInput1] = useState('');
	const [textInput2, onChangeTextInput2] = useState('');
	const [textInput3, onChangeTextInput3] = useState('');
	const [textInput4, onChangeTextInput4] = useState('');
	const [textInput5, onChangeTextInput5] = useState('');
	const [textInput6, onChangeTextInput6] = useState('');
	const [textInput7, onChangeTextInput7] = useState('');
	const [textInput8, onChangeTextInput8] = useState('');
	const [textInput9, onChangeTextInput9] = useState('');
	const [textInput10, onChangeTextInput10] = useState('');
	const [textInput11, onChangeTextInput11] = useState('');
	const [textInput12, onChangeTextInput12] = useState('');
	return (
		<SafeAreaView 
			style={{
				flex: 1,
				backgroundColor: "#FFFFFF",
			}}>
			<ScrollView  
				style={{
					flex: 1,
					backgroundColor: "#911F09",
				}}>
				<View 
					style={{
						marginTop: 58,
						marginBottom: 21,
						marginHorizontal: 6,
					}}>
					<View 
						style={{
							backgroundColor: "#D9D9D9",
							borderRadius: 52,
							paddingTop: 186,
							paddingBottom: 22,
						}}>
						<View 
							style={{
								alignItems: "center",
								marginBottom: 60,
							}}>
							<View 
								style={{
									alignItems: "center",
									paddingRight: 11,
								}}>
								<Text 
									style={{
										color: "#4F5476",
										fontSize: 28,
										fontWeight: "bold",
									}}>
									{"Escolher mesa"}
								</Text>
								<View 
									style={{
										width: 200,
										height: 2,
										backgroundColor: "#4F5476",
										borderRadius: 10,
									}}>
								</View>
							</View>
						</View>
						<View 
							style={{
								marginBottom: 9,
								marginLeft: 30,
							}}>
							<Text 
								style={{
									color: "#4F5476",
									fontSize: 16,
									fontWeight: "bold",
								}}>
								{"mesas disponíveis (1° andar):"}
							</Text>
							<View 
								style={{
									width: 77,
									height: 2,
									backgroundColor: "#4F5476",
									borderRadius: 10,
								}}>
							</View>
							<View 
								style={{
									width: 144,
									height: 2,
									backgroundColor: "#4F5476",
									borderRadius: 10,
									marginLeft: 83,
								}}>
							</View>
						</View>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput1}
							onChangeText={onChangeTextInput1}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 16,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 8,
								paddingHorizontal: 9,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput2}
							onChangeText={onChangeTextInput2}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 12,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								padding: 9,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput3}
							onChangeText={onChangeTextInput3}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 14,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 10,
								paddingHorizontal: 11,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput4}
							onChangeText={onChangeTextInput4}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 32,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 9,
								paddingHorizontal: 11,
							}}
						/>
						<Text 
							style={{
								color: "#4F5476",
								fontSize: 16,
								fontWeight: "bold",
								marginLeft: 31,
							}}>
							{"mesas disponíveis (2° andar):"}
						</Text>
						<View 
							style={{
								flexDirection: "row",
								marginBottom: 9,
								marginLeft: 30,
							}}>
							<View 
								style={{
									width: 77,
									height: 2,
									backgroundColor: "#4F5476",
									borderRadius: 10,
									marginRight: 6,
								}}>
							</View>
							<View 
								style={{
									width: 146,
									height: 2,
									backgroundColor: "#4F5476",
									borderRadius: 10,
								}}>
							</View>
						</View>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput5}
							onChangeText={onChangeTextInput5}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 17,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								padding: 9,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput6}
							onChangeText={onChangeTextInput6}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 11,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 8,
								paddingHorizontal: 9,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput7}
							onChangeText={onChangeTextInput7}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 14,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 10,
								paddingHorizontal: 11,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput8}
							onChangeText={onChangeTextInput8}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 10,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 9,
								paddingHorizontal: 11,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput9}
							onChangeText={onChangeTextInput9}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 17,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								padding: 9,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput10}
							onChangeText={onChangeTextInput10}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 12,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 8,
								paddingHorizontal: 9,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput11}
							onChangeText={onChangeTextInput11}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 13,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 9,
								paddingHorizontal: 11,
							}}
						/>
						<TextInput
							placeholder={"Mesa x"}
							value={textInput12}
							onChangeText={onChangeTextInput12}
							style={{
								color: "#FFFFFF",
								fontSize: 12,
								marginBottom: 18,
								marginLeft: 30,
								backgroundColor: "#B72F14",
								borderRadius: 10,
								paddingVertical: 9,
								paddingHorizontal: 11,
							}}
						/>
						<TouchableOpacity 
							style={{
								backgroundColor: "#F2CA85",
								borderRadius: 20,
								paddingVertical: 21,
								paddingHorizontal: 61,
								marginLeft: 87,
								marginRight: 25,
							}} onPress={()=>alert('Pressed!')}>
							<Text 
								style={{
									color: "#4F5476",
									fontSize: 20,
									fontWeight: "bold",
								}}>
								{"PROSSEGUIR"}
							</Text>
						</TouchableOpacity>
						<View 
							style={{
								alignItems: "flex-end",
							}}>
							<View 
								style={{
									flexDirection: "row",
									alignItems: "center",
									paddingRight: 2,
									marginRight: 20,
								}}>
								<Image
									source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/bzcrn726_expires_30_days.png"}} 
									resizeMode = {"stretch"}
									style={{
										width: 18,
										height: 27,
									}}
								/>
								<Text 
									style={{
										color: "#000000",
										fontSize: 12,
										fontWeight: "bold",
									}}>
									{"SAC"}
								</Text>
							</View>
						</View>
					</View>
					<View 
						style={{
							position: "absolute",
							top: 0,
							right: 0,
							left: 0,
							flexDirection: "row",
							backgroundColor: "#D9D9D9",
							borderTopLeftRadius: 52,
							borderTopRightRadius: 52,
							paddingTop: 11,
							paddingBottom: 18,
							paddingHorizontal: 25,
							shadowColor: "#00000040",
							shadowOpacity: 0.3,
							shadowOffset: {
							    width: 0,
							    height: 4
							},
							shadowRadius: 4,
							elevation: 4,
						}}>
						<View 
							style={{
								alignItems: "center",
								marginTop: 25,
							}}>
							<View 
								style={{
									width: 35,
									height: 5,
									backgroundColor: "#5D3A2F",
									borderRadius: 10,
									marginBottom: 6,
								}}>
							</View>
							<View 
								style={{
									width: 35,
									height: 5,
									backgroundColor: "#5D3A2F",
									borderRadius: 10,
									marginBottom: 6,
								}}>
							</View>
							<View 
								style={{
									width: 35,
									height: 5,
									backgroundColor: "#5D3A2F",
									borderRadius: 10,
								}}>
							</View>
						</View>
						<View 
							style={{
								flex: 1,
							}}>
						</View>
						<View 
							style={{
								alignItems: "center",
								marginRight: 64,
							}}>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/zyczy28l_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									width: 84,
									height: 67,
								}}
							/>
							<Image
								source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/yjulr96f_expires_30_days.png"}} 
								resizeMode = {"stretch"}
								style={{
									position: "absolute",
									bottom: 0,
									left: -36,
									width: 155,
									height: 57,
								}}
							/>
						</View>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/71m5gywb_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 25,
								height: 25,
								marginTop: 25,
								marginRight: 13,
							}}
						/>
						<Image
							source = {{uri: "https://storage.googleapis.com/tagjs-prod.appspot.com/v1/jnB8s9lH5z/ujaawsqs_expires_30_days.png"}} 
							resizeMode = {"stretch"}
							style={{
								width: 40,
								height: 40,
								marginTop: 18,
							}}
						/>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}