import { Home } from "../app/technical/Home";
import { DemostrativeVideo } from "@/app/technical/DemostrativeVideo";
import { Horoscope } from "@/app/technical/Horoscope";
import SchoolSearch from "@/app/technical/SchoolSearch";
import { TechnicalNews } from "@/app/technical/TechnicalNews";
import { UserInfo } from "@/app/technical/UserInfo";
import VisitInventory from "@/app/technical/VisitInventory";
import RegisterVisit from "@/app/technical/RegisterVisit";
import { VisitMap } from "@/app/technical/VisitMap";
import VisitDetail from "@/app/technical/VisitDetail";
import { WeatherState } from "@/app/technical/WeatherState";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawerContent from "@/components/CustomDrawerContent";
import LoginScreen from "../app/auth/LoginScreen";
import RegisterScreen from "../app/auth/RegisterScreen";
import RecoveryPassword from "../app/auth/RecoveryPassword";
import { useAuth } from "@/contexts/AuthContext";

const Drawer = createDrawerNavigator();

export const AppNavigator = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {isAuthenticated ? (
        <>
          <Drawer.Screen name="Inicio" component={Home} />
          <Drawer.Screen name="Escuelas" component={SchoolSearch} />
          <Drawer.Screen
            name="Visitas Registradas"
            component={VisitInventory}
          />
          <Drawer.Screen
            name="Registrar Visita"
            component={RegisterVisit}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="Mapa de Visitas"
            component={VisitMap}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen
            name="Detalles"
            component={VisitDetail}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
          <Drawer.Screen name="Noticias" component={TechnicalNews} />
          <Drawer.Screen name="Clima" component={WeatherState} />
          <Drawer.Screen name="Horóscopo" component={Horoscope} />
          <Drawer.Screen
            name="Video Demostrativo"
            component={DemostrativeVideo}
          />
          <Drawer.Screen name="Acerca De" component={UserInfo} />
        </>
      ) : (
        <>
          <Drawer.Screen name="Iniciar Sesión" component={LoginScreen} />
          <Drawer.Screen name="Registrarse" component={RegisterScreen} />
          <Drawer.Screen
            name="Recuperar Clave"
            component={RecoveryPassword}
            options={{
              drawerItemStyle: { display: "none" },
            }}
          />
        </>
      )}
    </Drawer.Navigator>
  );
};
