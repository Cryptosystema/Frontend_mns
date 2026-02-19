#!/usr/bin/env bash
###############################################################################
# MNS Terminal — Dev Container Recovery Master Script
# 
# Решает проблему ENOPRO (File System Provider disconnection)
# и восстанавливает полную работоспособность среды разработки.
#
# Использование:
#   chmod +x fix-devcontainer.sh && ./fix-devcontainer.sh
#
# Или из любого работающего терминала (напр. из хост-машины через docker exec):
#   docker exec -it <container_id> bash /workspaces/mns-terminal/fix-devcontainer.sh
###############################################################################

set -euo pipefail

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

WORKSPACE="/workspaces/mns-terminal"

###############################################################################
# 1. ДИАГНОСТИКА
###############################################################################
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  MNS Terminal — Recovery Script v1.0${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""

echo -e "${YELLOW}[1/7] Диагностика файловой системы...${NC}"

# Проверяем доступ к workspace
if [ -d "$WORKSPACE" ]; then
  echo -e "  ${GREEN}✓${NC} Директория $WORKSPACE существует"
else
  echo -e "  ${RED}✗${NC} Директория $WORKSPACE не найдена!"
  echo -e "  ${RED}  Вы внутри dev container? Проверьте mount.${NC}"
  exit 1
fi

# Проверяем чтение/запись
if touch "$WORKSPACE/.recovery-test" 2>/dev/null; then
  rm -f "$WORKSPACE/.recovery-test"
  echo -e "  ${GREEN}✓${NC} Файловая система доступна для чтения/записи"
else
  echo -e "  ${RED}✗${NC} Файловая система READ-ONLY или недоступна!"
  echo -e "  ${YELLOW}  Попытка remount...${NC}"
  mount -o remount,rw / 2>/dev/null || true
fi

# Проверяем git
if [ -d "$WORKSPACE/.git" ]; then
  echo -e "  ${GREEN}✓${NC} Git-репозиторий обнаружен"
else
  echo -e "  ${RED}✗${NC} Git-репозиторий не найден"
fi

###############################################################################
# 2. ОЧИСТКА КЭШЕЙ VS CODE
###############################################################################
echo ""
echo -e "${YELLOW}[2/7] Очистка кэшей VS Code Server...${NC}"

# VS Code Server хранит кэши в домашней директории
VSCODE_SERVER_DIR="$HOME/.vscode-server"
VSCODE_REMOTE_DIR="$HOME/.vscode-remote"

for dir in "$VSCODE_SERVER_DIR" "$VSCODE_REMOTE_DIR"; do
  if [ -d "$dir" ]; then
    # Очищаем кэш расширений (не сами расширения)
    if [ -d "$dir/data/CachedData" ]; then
      rm -rf "$dir/data/CachedData"
      echo -e "  ${GREEN}✓${NC} Очищен CachedData в $(basename $dir)"
    fi
    # Очищаем состояние файловой системы
    if [ -d "$dir/data/User/workspaceStorage" ]; then
      find "$dir/data/User/workspaceStorage" -name "*.db" -mmin +60 -delete 2>/dev/null || true
      echo -e "  ${GREEN}✓${NC} Очищены устаревшие workspace DB в $(basename $dir)"
    fi
  fi
done

# Codespaces-specific paths
if [ -d "/home/codespace/.vscode-remote" ]; then
  rm -rf /home/codespace/.vscode-remote/data/CachedData 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} Очищен Codespace CachedData"
fi

echo -e "  ${GREEN}✓${NC} Кэши очищены"

###############################################################################
# 3. УБИТЬ ЗАВИСШИЕ ПРОЦЕССЫ
###############################################################################
echo ""
echo -e "${YELLOW}[3/7] Проверка зависших процессов...${NC}"

# Убиваем зависшие node процессы (старые vite dev серверы, etc.)
STALE_PIDS=$(pgrep -f "node.*vite\|node.*esbuild\|node.*tsc" 2>/dev/null || true)
if [ -n "$STALE_PIDS" ]; then
  echo "$STALE_PIDS" | xargs kill -9 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} Убиты зависшие Node-процессы: $STALE_PIDS"
else
  echo -e "  ${GREEN}✓${NC} Зависших процессов не обнаружено"
fi

# Проверяем, не занят ли порт 5173 (Vite default)
if lsof -i :5173 >/dev/null 2>&1; then
  lsof -ti :5173 | xargs kill -9 2>/dev/null || true
  echo -e "  ${GREEN}✓${NC} Освобождён порт 5173"
fi

###############################################################################
# 4. ВОССТАНОВЛЕНИЕ NODE_MODULES
###############################################################################
echo ""
echo -e "${YELLOW}[4/7] Проверка и восстановление зависимостей...${NC}"

cd "$WORKSPACE"

# Проверяем наличие node/npm
if ! command -v node &>/dev/null; then
  echo -e "  ${RED}✗${NC} Node.js не установлен!"
  echo -e "  ${YELLOW}  Устанавливаю через nvm...${NC}"
  if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    nvm install --lts
  else
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - 2>/dev/null
    apt-get install -y nodejs 2>/dev/null || true
  fi
fi

NODE_V=$(node --version 2>/dev/null || echo "N/A")
NPM_V=$(npm --version 2>/dev/null || echo "N/A")
echo -e "  ${GREEN}✓${NC} Node: $NODE_V | npm: $NPM_V"

# Проверяем package.json
if [ ! -f "package.json" ]; then
  echo -e "  ${RED}✗${NC} package.json не найден!"
  exit 1
fi

# Проверяем node_modules
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.package-lock.json" ]; then
  echo -e "  ${YELLOW}⟳${NC} node_modules отсутствует или повреждён. Переустановка..."
  rm -rf node_modules
  npm install --prefer-offline 2>&1 | tail -5
  echo -e "  ${GREEN}✓${NC} Зависимости установлены"
else
  # Быстрая проверка целостности
  MISSING=$(npm ls --depth=0 2>&1 | grep "MISSING" | wc -l)
  if [ "$MISSING" -gt 0 ]; then
    echo -e "  ${YELLOW}⟳${NC} Обнаружено $MISSING отсутствующих пакетов. Доустановка..."
    npm install 2>&1 | tail -3
  else
    echo -e "  ${GREEN}✓${NC} node_modules в порядке"
  fi
fi

###############################################################################
# 5. ПРОВЕРКА TYPESCRIPT / СБОРКИ
###############################################################################
echo ""
echo -e "${YELLOW}[5/7] Проверка TypeScript и сборки...${NC}"

# Проверяем tsconfig
if [ -f "tsconfig.json" ]; then
  echo -e "  ${GREEN}✓${NC} tsconfig.json найден"
else
  echo -e "  ${RED}✗${NC} tsconfig.json отсутствует!"
fi

# Пробуем собрать
echo -e "  ${CYAN}⟳${NC} Запуск сборки (tsc + vite build)..."
BUILD_OUTPUT=$(npm run build 2>&1)
BUILD_EXIT=$?

if [ $BUILD_EXIT -eq 0 ]; then
  echo -e "  ${GREEN}✓${NC} Сборка успешна"
else
  echo -e "  ${YELLOW}!${NC} Сборка завершилась с ошибками (код: $BUILD_EXIT)"
  echo "$BUILD_OUTPUT" | tail -15
  echo -e "  ${YELLOW}  (Ошибки сборки не критичны для работы терминала)${NC}"
fi

###############################################################################
# 6. ПРОВЕРКА GIT
###############################################################################
echo ""
echo -e "${YELLOW}[6/7] Проверка Git...${NC}"

if command -v git &>/dev/null && [ -d ".git" ]; then
  GIT_STATUS=$(git status --porcelain 2>/dev/null | wc -l)
  GIT_BRANCH=$(git branch --show-current 2>/dev/null || echo "unknown")
  GIT_REMOTE=$(git remote get-url origin 2>/dev/null || echo "no remote")
  
  echo -e "  ${GREEN}✓${NC} Ветка: $GIT_BRANCH"
  echo -e "  ${GREEN}✓${NC} Remote: $GIT_REMOTE"
  echo -e "  ${GREEN}✓${NC} Несохранённых изменений: $GIT_STATUS"
  
  # Проверяем связь с remote
  if git ls-remote --exit-code origin HEAD >/dev/null 2>&1; then
    echo -e "  ${GREEN}✓${NC} Связь с GitHub OK"
  else
    echo -e "  ${YELLOW}!${NC} Нет связи с GitHub (возможно, нет токена)"
  fi
else
  echo -e "  ${YELLOW}!${NC} Git недоступен"
fi

###############################################################################
# 7. ФИНАЛЬНЫЙ ОТЧЁТ
###############################################################################
echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}  ИТОГОВАЯ ДИАГНОСТИКА${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  Рабочая директория:  ${GREEN}$WORKSPACE${NC}"
echo -e "  Файловая система:    $([ -w "$WORKSPACE" ] && echo -e "${GREEN}OK (rw)${NC}" || echo -e "${RED}ПРОБЛЕМА${NC}")"
echo -e "  Node.js:             ${GREEN}$(node --version 2>/dev/null || echo 'N/A')${NC}"
echo -e "  npm:                 ${GREEN}$(npm --version 2>/dev/null || echo 'N/A')${NC}"
echo -e "  node_modules:        $([ -d "node_modules" ] && echo -e "${GREEN}OK${NC}" || echo -e "${RED}ОТСУТСТВУЕТ${NC}")"
echo -e "  TypeScript:          $(npx tsc --version 2>/dev/null && echo "" || echo -e "${RED}N/A${NC}")"
echo -e "  Vite:                $(npx vite --version 2>/dev/null || echo -e "${RED}N/A${NC}")"
echo -e "  Git:                 ${GREEN}$(git --version 2>/dev/null || echo 'N/A')${NC}"
echo ""

echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Восстановление завершено!${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${YELLOW}Если проблема ENOPRO сохраняется:${NC}"
echo -e "  1. Нажмите ${CYAN}Ctrl+Shift+P${NC} → ${CYAN}Developer: Reload Window${NC}"
echo -e "  2. Если не помогло: ${CYAN}Ctrl+Shift+P${NC} → ${CYAN}Dev Containers: Rebuild Container${NC}"
echo -e "  3. Крайняя мера: закройте VS Code, откройте заново"
echo ""
echo -e "  ${YELLOW}После восстановления запустите:${NC}"
echo -e "  ${CYAN}npm run dev${NC}    — запуск dev-сервера"
echo -e "  ${CYAN}npm run build${NC}  — проверка сборки"
echo ""
