import React, { Component, Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Spinner from '../app/shared/Spinner';
const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const Buttons = lazy(() => import('./basic-ui/Buttons'));
const Error404 = lazy(() => import('./user-pages/Error404'));
const Error500 = lazy(() => import('./user-pages/Error500'));
const BlankPage = lazy(() => import('./user-pages/BlankPage'));
const Usuarios = lazy(() => import('./cadastros/usuario/Usuario'));
const Empresas = lazy(() => import('./cadastros/empresa/Empresa'));
const EmpresasFrm = lazy(() => import('./cadastros/empresa/FrmEmpresa'));
const Temas = lazy(() => import('./cadastros/tema/Tema'));
const TemasFrm = lazy(() => import('./cadastros/tema/FrmTema'));
const Gestores = lazy(() => import('./cadastros/gestor/Gestor'));
const GestoresFrm = lazy(() => import('./cadastros/gestor/FrmGestor'));
const Setores = lazy(() => import('./cadastros/setor/Setor'));
const SetoresFrm = lazy(() => import('./cadastros/setor/FrmSetor'));
const Cargos = lazy(() => import('./cadastros/cargo/Cargo'));
const CargosFrm = lazy(() => import('./cadastros/cargo/FrmCargo'));
const Usuario = lazy(() => import('./cadastros/usuario/Usuario'));
const UsuarioFrm = lazy(() => import('./cadastros/usuario/FrmUsuario'));
const Login = lazy(() => import('./user-pages/Login'));
const Alertas = lazy(() => import('./alertas/Alertas'));
const FrmAlerta = lazy(() => import('./alertas/FrmAlerta'));
const Materia = lazy(() => import('./conteudo/materia/Materia'));
const MateriaFrm = lazy(() => import('./conteudo/materia/FrmMateria'));
const Categorias = lazy(() => import('./cadastros/categoria/Categoria'));
const CategoriasFrm = lazy(() => import('./cadastros/categoria/FrmCategoria'));
const ConteudoLista = lazy(() => import('./conteudo/materia/Conteudo'));
const ListaMaterias = lazy(() => import('./conteudo/materia/ListaMaterias'));
const ShowMateria = lazy(() => import('./conteudo/materia/ShowMateria'));
const Favorito = lazy(() => import('./conteudo/materia/Favorito'));
const Ferias = lazy(() => import('./cadastros/ferias/Ferias'));
const FeriasFrm = lazy(() => import('./cadastros/ferias/FrmFerias'));
const FaleConoscoFrm = lazy(() => import('./fale-conosco/FrmFaleConosco'));

class AppRoutes extends Component {
  render() {
    return (
      
      <Suspense fallback={<Spinner />}>
        
        <Switch>          
          <Route exact path="/" component={Dashboard} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/basic-ui/buttons" component={Buttons} />
          <Route exact path="/user-pages/error-404" component={Error404} />
          <Route exact path="/user-pages/error-500" component={Error500} />
          <Route exact path="/user-pages/blank-page" component={BlankPage} />
          <Route exact path="/cadastros/usuario/usuario" component={Usuarios} />
          <Route exact path="/cadastros/empresa/add" component={EmpresasFrm} />
          <Route exact path="/cadastros/empresa/edit/:id" component={EmpresasFrm} />
          <Route exact path="/cadastros/empresa" component={Empresas} />
          <Route exact path="/cadastros/tema/add" component={TemasFrm} />
          <Route exact path="/cadastros/tema" component={Temas} />
          <Route exact path="/cadastros/tema/edit/:id" component={TemasFrm} />
          <Route exact path="/cadastros/gestor/add" component={GestoresFrm} />
          <Route exact path="/cadastros/gestor" component={Gestores} />
          <Route exact path="/cadastros/gestor/edit/:id" component={GestoresFrm} />
          <Route exact path="/cadastros/setor/add" component={SetoresFrm} />
          <Route exact path="/cadastros/setor/edit/:id" component={SetoresFrm} />
          <Route exact path="/cadastros/setor" component={Setores} />
          <Route exact path="/cadastros/cargo/add" component={CargosFrm} />
          <Route exact path="/cadastros/cargo" component={Cargos} />
          <Route exact path="/cadastros/cargo/edit/:id" component={CargosFrm} />
          <Route exact path="/cadastros/usuario" component={Usuario} />
          <Route exact path="/cadastros/usuario/add" component={UsuarioFrm} />
          <Route exact path="/cadastros/usuario/edit/:id" component={UsuarioFrm} />
          <Route exact path="/cadastros/usuario/edit/:id" component={UsuarioFrm} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/alertas" component={Alertas} />
          <Route exact path="/alertas/add" component={FrmAlerta} />
          <Route exact path="/alertas/edit/:id" component={FrmAlerta} />
          <Route exact path="/cadastros" component={Dashboard} />
          <Route exact path="/cadastros/categoria/add" component={CategoriasFrm} />
          <Route exact path="/cadastros/categoria" component={Categorias} />
          <Route exact path="/cadastros/categoria/edit/:id" component={CategoriasFrm} />
          <Route exact path="/categorias/materia/:id" component={ShowMateria} />
          <Route exact path="/categorias/:id" component={ListaMaterias} />
          <Route exact path="/categorias" component={ConteudoLista} />
          <Route exact path="/conteudo/materia" component={Materia} />
          <Route exact path="/conteudo/materia/add" component={MateriaFrm} />
          <Route exact path="/conteudo/materia/edit/:id" component={MateriaFrm} />
          <Route exact path="/conteudo/favorito/" component={Favorito} />
          <Route exact path="/cadastros/ferias/" component={Ferias} />
          <Route exact path="/cadastros/ferias/add" component={FeriasFrm} />
          <Route exact path="/cadastros/ferias/edit/:id" component={FeriasFrm} />
          <Route exact path="/fale-conosco" component={FaleConoscoFrm} />

          <Redirect to="/user-pages/error-404" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;