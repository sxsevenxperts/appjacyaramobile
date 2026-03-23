# Clínica Estética Jacyara Ponte - Aplicativo Mobile

Aplicativo mobile completo para gerenciamento de agendamentos, clientes, relatórios e financeiro para a Clínica Estética Jacyara Ponte.

## Tecnologias

- **React Native** com Expo
- **Supabase** para autenticação e banco de dados
- **React Navigation** para navegação
- **Expo Notifications** para notificações push
- **date-fns** para manipulação de datas

## Recursos

✅ **Dashboard** - Estatísticas de agendamentos, clientes e faturamento
✅ **Agendamentos** - Calendário com visualização por dia/semana/mês
✅ **Clientes** - Gestão de clientes com fotos antes/depois
✅ **Relatórios** - Faltas, remarcações, procedimentos vencendo
✅ **Financeiro** - Registro de pagamentos e faturamento
✅ **Configurações** - Perfil do usuário e preferências
✅ **Autenticação** - Login e registro com Supabase
✅ **Notificações** - Push notifications para reminders

## Instalação

### Pré-requisitos

- Node.js 18+ instalado
- Expo CLI: `npm install -g expo-cli`
- Conta Expo
- Android Studio ou Xcode (para compilação)

### Setup Inicial

```bash
# Navegar ao diretório do projeto
cd ClinicaEsteticaJacyaraPonte

# Instalar dependências
npm install --legacy-peer-deps

# Iniciar o servidor de desenvolvimento
npm start
```

### Rodar no Android

```bash
# Via emulador
npm run android

# Ou via Expo Go app (escanear QR code)
npm start
```

### Rodar no iOS

```bash
npm run ios
```

## Variáveis de Ambiente

As credenciais Supabase estão configuradas em `src/services/supabaseClient.ts`:

```typescript
const supabaseUrl = 'https://gzkwtiihltahvnmtrgfv.supabase.co'
const supabaseAnonKey = 'seu-anon-key-aqui'
```

## Build para Produção

### APK Android

```bash
# Build APK testável
npm run build:android

# Você receberá um arquivo .apk para distribuição
```

### Para Google Play Store

1. Configure EAS CLI:
```bash
npm install -g eas-cli
eas login
```

2. Inicialize EAS:
```bash
eas init --platform android
```

3. Build para Play Store:
```bash
eas build --platform android --release
```

4. Submit to Play Store:
```bash
eas submit --platform android --latest
```

## Estrutura do Projeto

```
ClinicaEsteticaJacyaraPonte/
├── src/
│   ├── App.tsx                 # Entry point
│   ├── context/
│   │   └── AuthContext.tsx     # Gerenciamento de autenticação
│   ├── navigation/
│   │   ├── MainNavigator.tsx   # Bottom tab navigation
│   │   └── AuthNavigator.tsx   # Auth screens
│   ├── screens/
│   │   ├── DashboardScreen.tsx
│   │   ├── AgendamentosScreen.tsx
│   │   ├── ClientesScreen.tsx
│   │   ├── RelatoriosScreen.tsx
│   │   ├── FinanceiroScreen.tsx
│   │   ├── ConfiguracoesScreen.tsx
│   │   └── auth/
│   │       ├── LoginScreen.tsx
│   │       └── RegisterScreen.tsx
│   └── services/
│       ├── supabaseClient.ts   # Supabase initialization
│       └── notificationService.ts
├── app.json                    # Expo configuration
├── babel.config.js            # Babel configuration
├── index.js                   # Entry point
└── package.json
```

## Credenciais Padrão

- **Email**: jacyaraponte@gmail.com
- **Senha**: 050315

## Próximas Melhorias

- [ ] Integração com WhatsApp para lembretes
- [ ] Pagamentos PIX com QR Code
- [ ] Programa de Fidelidade (pontos, cupons)
- [ ] Gestão de Equipe (comissões, performance)
- [ ] Assinatura Digital
- [ ] Geração de PDF para recibos
- [ ] Gamificação (badges, rankings)

## Suporte

Para questões ou problemas, consulte a documentação:
- [React Native](https://reactnative.dev/)
- [Expo](https://docs.expo.dev/)
- [Supabase](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)

## License

Desenvolvido para Clínica Estética Jacyara Ponte © 2024
