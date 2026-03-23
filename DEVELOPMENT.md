# Guia de Desenvolvimento

Instruções detalhadas para desenvolvimento, testes e build do aplicativo.

## Iniciando o Desenvolvimento

### 1. Setup Inicial

```bash
cd ClinicaEsteticaJacyaraPonte
npm install --legacy-peer-deps
```

### 2. Rodar em Desenvolvimento

```bash
# Start o servidor Expo
npm start

# Em outro terminal, para Android
npm run android

# Ou para iOS
npm run ios

# Ou escanear QR code com Expo Go app
```

### 3. Estrutura de Desenvolvimento

**Padrão de arquivos:**
- `src/screens/` - Telas principais
- `src/screens/auth/` - Telas de autenticação
- `src/navigation/` - Configuração de navegação
- `src/context/` - Context API para estado global
- `src/services/` - Serviços (Supabase, Notificações, etc)
- `src/hooks/` - Hooks customizados
- `src/components/` - Componentes reutilizáveis (quando necessário)

## Testando o Aplicativo

### Teste em Expo Go (Quick)

```bash
npm start
# Escanear QR code com app Expo Go no seu celular
```

### Teste em Emulador Android

```bash
# Certifique-se de ter Android Studio instalado
npm run android
```

### Teste em Emulador iOS (Mac)

```bash
npm run ios
```

## Adicionando Novas Features

### Adicionar Nova Tela

1. Criar arquivo em `src/screens/NovaTelaScreen.tsx`
2. Adicionar rota em `src/navigation/MainNavigator.tsx`
3. Usar hooks e context para dados

Exemplo:

```typescript
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function NovaTelaScreen() {
  return (
    <View style={styles.container}>
      <Text>Nova Tela</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8e8e0',
  },
})
```

### Usar Dados Supabase

```typescript
import { useData } from '../hooks/useData'

export default function MeuComponente() {
  const { data, loading, refetch } = useData('minha_tabela')

  return (
    // seu layout aqui
  )
}
```

### Adicionar Notificação Push

```typescript
import { scheduleAppointmentReminder } from '../services/notificationService'

// Agendar lembrete
await scheduleAppointmentReminder(
  'Consulta com Dr. Silva',
  15, // minutos antes
  new Date() // data/hora
)
```

## Build e Deploy

### Pré-requisitos

- EAS CLI instalada: `npm install -g eas-cli`
- Conta Expo criada
- Android ou iOS signing certificates

### Build APK Local (Teste)

```bash
# Compile para APK de teste (sem assinatura)
npx expo run:android

# Ou via EAS
eas build --platform android --profile preview
```

### Build para Play Store

1. **Configure EAS:**

```bash
eas init
# Escolha criar novo projeto ou usar existente
```

2. **Build Release:**

```bash
eas build --platform android --release
```

3. **Submit to Play Store:**

```bash
eas submit --platform android
```

### Configuração de Signing

Criar certificado auto-assinado:

```bash
eas credentials

# Seguir instruções para criar keystore
```

## Variáveis de Ambiente

### .env.local (não commitar)

```
NEXT_PUBLIC_SUPABASE_URL=https://gzkwtiihltahvnmtrgfv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=seu-key-aqui
WHATSAPP_API_TOKEN=seu-token-whatsapp
```

### app.json - Projeto Expo

Atualizar `extra.eas.projectId` após criar projeto no Expo:

```bash
eas init
```

## Testes

### Teste Manual Checklist

- [ ] Login com credenciais válidas
- [ ] Cadastro de novo cliente
- [ ] Criar novo agendamento
- [ ] Visualizar calendário (dia/semana/mês)
- [ ] Acessar relatórios e verificar estatísticas
- [ ] Enviar mensagem WhatsApp de teste
- [ ] Verificar notificações push
- [ ] Logout

### Teste de Performance

```bash
# Usar React Profiler no Chrome DevTools
# Conectar app com Expo e acessar console
```

## Debugging

### Logs

```typescript
import { useAuth } from './context/AuthContext'

const { user, loading } = useAuth()
console.log('User:', user)
console.log('Loading:', loading)
```

### React DevTools

```bash
# Instalar extensão do React Native DevTools
# Ativar com Ctrl+M (Android) ou Cmd+D (iOS)
```

## Commits e Versionamento

### Padrão de Commits

```
feat: adiciona novo recurso
fix: corrige bug
refactor: reorganiza código
style: formata código
docs: atualiza documentação
test: adiciona testes
```

Exemplo:

```bash
git commit -m "feat: adiciona screen de fidelidade com pontos"
git commit -m "fix: corrige bug de autenticação no login"
```

### Versionamento Semântico

```
MAJOR.MINOR.PATCH
- MAJOR: mudanças incompatíveis
- MINOR: novos recursos compatíveis
- PATCH: correções de bugs
```

## Troubleshooting

### Problema: "Metro bundler error"

```bash
npm start -- --reset-cache
```

### Problema: "Módulo não encontrado"

```bash
rm -rf node_modules
npm install --legacy-peer-deps
```

### Problema: "Supabase connection failed"

1. Verificar URLs e keys em `supabaseClient.ts`
2. Verificar conectividade de rede
3. Verificar status do Supabase (supabase.com/status)

### Problema: "Notificações não funcionam"

1. Verificar permissões no `app.json`
2. Testar em dispositivo físico (não emulador)
3. Verificar token Expo em `notificationService.ts`

## Recursos Úteis

- [React Native Docs](https://reactnative.dev/)
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [EAS Build Docs](https://docs.expo.dev/eas-update/introduction/)

## Contato

Para suporte ou dúvidas durante o desenvolvimento, consulte a documentação ou abra uma issue no GitHub.
