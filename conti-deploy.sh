if [ -z $BRANCH ]; then
	BRANCH="master"
else
	BRANCH=$BRANCH
fi

git fetch
LOCAL=`git rev-parse "$BRANCH"`
REMOTE=`git rev-parse origin/"$BRANCH"`

if [ "$LOCAL" != "$REMOTE" ]; then
	./build.sh
fi
