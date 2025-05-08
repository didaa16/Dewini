package tn.dewini.backend.Services.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${application.security.jwt.expiration}")
    private long jwtExpiration;

    @Value("${application.security.jwt.refresh-expiration}")
    private long refreshTokenExpiration;

    @Value("${application.security.jwt.secret-key}")
    private String jwtSecretKey;

    public String generateToken(UserDetails userDetails, Integer userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return buildToken(claims, userDetails, jwtExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails, Integer userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        return buildToken(claims, userDetails, refreshTokenExpiration);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration) {
        List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.startsWith("ROLE_") ? authority : "ROLE_" + authority)
                .toList();
        extraClaims.put("authorities", authorities);
        System.out.println("Generating token for user: " + userDetails.getUsername());
        System.out.println("Claims: " + extraClaims);

        return Jwts.builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey())
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private final Map<String, Set<String>> invalidatedTokens = new ConcurrentHashMap<>();

    public void invalidateAllTokensForUser(String username) {
        if (username != null && !username.isEmpty()) {
            invalidatedTokens.put(username, Collections.synchronizedSet(new HashSet<>()));
        }
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Long extractUserId(String token) {
        return extractClaim(token, claims -> claims.get("userId", Long.class));
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}